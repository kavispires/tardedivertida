// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { CaptchaIcon } from 'icons/CaptchaIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectAll } from './StepSelectAll';

export function PhaseAreYouARobot({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitCaptcha = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<CaptchaIcon />}
      title={<Translate pt="Você é um robô?" en="Are you a robot?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>
        <Translate pt={<>Prove que você não é um robô!</>} en={<>Prove you are not a robot!</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NAO_SOU_ROBO.ARE_YOU_A_ROBOT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSelectAll
          user={user}
          players={players}
          announcement={announcement}
          onSubmitCaptcha={onSubmitCaptcha}
          captcha={state.captcha}
          options={state.options}
          robot={state.robot}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
