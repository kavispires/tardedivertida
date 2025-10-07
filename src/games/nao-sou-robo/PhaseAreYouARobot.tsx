// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { CaptchaIcon } from 'icons/CaptchaIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { NAO_SOU_ROBO_PHASES } from './utils/constants';
import { StepSelectAll } from './StepSelectAll';

export function PhaseAreYouARobot({ state, players, user }: PhaseProps) {
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
    <PhaseContainer phase={state?.phase} allowedPhase={NAO_SOU_ROBO_PHASES.ARE_YOU_A_ROBOT}>
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
