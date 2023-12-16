// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitSuggestionsAPIRequest } from './utils/api-requests';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepSuggestion } from './StepSuggestion';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { WaitingRoomSuggestions } from './components/WaitingRoomSuggestions';

export function PhaseSuggest({ state, players, info }: PhaseProps) {
  const user = useUser(players, state);
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
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.SUGGEST}
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
