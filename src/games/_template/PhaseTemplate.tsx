// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepTemplate } from './StepTemplate';
import type { PhaseTemplateState } from './utils/types';
import { TEMPLATE_PHASES } from './utils/constants';

export function PhaseTemplate({ players, state }: PhaseProps<PhaseTemplateState>) {
  const user = useUser(players, state);
  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<TDIcon />}
      title={<Translate pt="?" en="?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TEMPLATE_PHASES.UNKNOWN}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepTemplate user={user} players={players} announcement={announcement} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
