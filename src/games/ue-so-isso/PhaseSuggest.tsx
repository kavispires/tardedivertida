// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useOnSubmitSuggestionsAPIRequest } from './utils/api-requests';
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
import { WritingRules } from './components/RulesBlobs';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

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
      <WritingRules />
      {isUserTheGuesser && (
        <Instruction contained>
          <Translate
            pt="Já que você é o adivinhador, relaxe e aguarde..."
            en="Since you're the guesser, just relax and wait..."
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
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
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
            onSendSuggestions={onSendSuggestions}
            secretWord={state.secretWord}
            suggestionsNumber={state.suggestionsNumber}
            announcement={announcement}
            user={user}
          />
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
