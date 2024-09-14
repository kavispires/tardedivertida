// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { CaptchaIcon } from 'icons/CaptchaIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
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
