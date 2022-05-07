// State & Hooks
import { useIsUserReady, useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepGuess } from './StepGuess';
import { StepPsychicGuess } from './StepPsychicGuess';

function PhaseGuess({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="sound-wave"
          title={translate('Adivinhação', 'Guessing')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Você está sincronizado telepaticamente?" en="Are you telepathically in sync?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserThePsychic}>
          <StepPsychicGuess
            currentCategory={state.currentCategory}
            onSendGuess={onSendGuess}
            players={players}
          />
          <StepGuess currentCategory={state.currentCategory} onSendGuess={onSendGuess} players={players} />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuess;
