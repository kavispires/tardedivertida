// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';

export function PhaseDuel({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_NAO_MATA.DUEL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={<Translate pt="Duelo de Dois" en="The Duel" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate
              pt="Pega tudo? Divide irmãmente? Garante um?"
              en="Take one? Share equally? Or garante one?"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here {user.name}s</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}
