// State & Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
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
import { SoundWaveIcon } from 'components/icons/SoundWaveIcon';

function PhaseGuess({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep(0);
  const [, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SoundWaveIcon />}
      title={<Translate pt="Adivinhação" en="Guessing" />}
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Você está sincronizado telepaticamente?" en="Are you telepathically in sync?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <ViewOr orCondition={isUserThePsychic}>
          <StepPsychicGuess
            currentCategory={state.currentCategory}
            onSendGuess={onSendGuess}
            players={players}
            announcement={announcement}
          />
          <StepGuess
            currentCategory={state.currentCategory}
            onSendGuess={onSendGuess}
            announcement={announcement}
          />
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuess;
