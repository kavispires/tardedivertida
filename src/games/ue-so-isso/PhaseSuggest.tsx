import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { WritingIcon } from '@icons/WritingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitSuggestionsAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import type { PhaseSuggestState } from './utils/types';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { WaitingRoomSuggestions } from './components/WaitingRoomSuggestions';
import { StepSuggestion } from './StepSuggestion';

export function PhaseSuggest({ state, players, user }: PhaseProps<PhaseSuggestState>) {
  const { step, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSendSuggestions = useOnSubmitSuggestionsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={
        <Translate
          pt="Escreva uma dica!"
          en="Write a Clue!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      {isUserTheGuesser ? (
        <Surface>
          <Translate
            pt="Já que você é o adivinhador, relaxe e aguarde..."
            en="Since you're the guesser, just relax and wait..."
          />
        </Surface>
      ) : (
        <Surface>
          <Translate
            pt="Hora de escrever uma dica para a palavra secreta!"
            en="Time to write a clue for the secret word!"
          />
        </Surface>
      )}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={UE_SO_ISSO_PHASES.SUGGEST}
      className="word-selection-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <WaitingRoomSuggestions user={user} /> }}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserTheGuesser}>
            <GuesserWaitingRoom
              players={players}
              instructionSuffix={{
                pt: 'escrevem dicas',
                en: 'write clues',
              }}
              phase={state.phase}
              guesser={guesser}
              turnOrder={state.gameOrder}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheGuesser}>
            <StepSuggestion
              guesser={guesser}
              isUserTheGuesser={isUserTheGuesser}
              onSendSuggestions={onSendSuggestions}
              secretWord={state.secretWord}
              suggestionsNumber={state.suggestionsNumber}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
