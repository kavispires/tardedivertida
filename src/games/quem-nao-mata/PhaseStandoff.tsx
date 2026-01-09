// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { QUEM_NAO_MATA_PHASES } from './utils/constants';

export function PhaseStandoff({ state, players, user }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUEM_NAO_MATA_PHASES.STANDOFF}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={
            <Translate
              pt="O pega pra capar!"
              en="Standoff Results"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>Add text here</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here {user.name}</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}
