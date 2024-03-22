// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepTemplate } from './StepTemplate';
// Sass
import 'utils/styles.scss';

export function PhaseTemplate({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TEMPLATE.UNKNOWN}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepTemplate user={user} players={players} announcement={announcement} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
