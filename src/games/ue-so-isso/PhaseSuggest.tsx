// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitSuggestionsAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { WaitingRoomSuggestions } from './components/WaitingRoomSuggestions';
import { StepSuggestion } from './StepSuggestion';

export function PhaseSuggest({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSendSuggestions = useOnSubmitSuggestionsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={<Translate pt="Escreva uma dica!" en="Write a Clue!" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      {isUserTheGuesser ? (
        <Instruction>
          <Translate
            pt="Já que você é o adivinhador, relaxe e aguarde..."
            en="Since you're the guesser, just relax and wait..."
          />
        </Instruction>
      ) : (
        <Instruction>
          <Translate
            pt="Hora de escrever uma dica para a palavra secreta!"
            en="Time to write a clue for the secret word!"
          />
        </Instruction>
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
        <ViewOr condition={isUserTheGuesser}>
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

          <StepSuggestion
            guesser={guesser}
            isUserTheGuesser={isUserTheGuesser}
            onSendSuggestions={onSendSuggestions}
            secretWord={state.secretWord}
            suggestionsNumber={state.suggestionsNumber}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
