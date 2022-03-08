// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
import { useOnSubmitSuggestionsAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate, ViewOr } from 'components';
import { StepSuggestion } from './StepSuggestion';
import { WritingRules } from './RulesBlobs';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';

function PhaseSuggest({ state, players, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSendSuggestions = useOnSubmitSuggestionsAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.SUGGEST}
      className="word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="writing"
          title={translate('Escreva uma dica!', 'Write a Clue!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

        {/* Step 1 */}

        <ViewOr orCondition={isUserTheGuesser}>
          <GuesserWaitingRoom
            players={players}
            instructionSuffix={{
              pt: 'escrevem dicas',
              en: 'write clues',
            }}
          />

          <StepSuggestion
            guesser={guesser}
            onSendSuggestions={onSendSuggestions}
            secretWord={state.secretWord}
            suggestionsNumber={state.suggestionsNumber}
            players={players}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseSuggest;
