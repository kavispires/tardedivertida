// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepRanking } from './StepRanking';

export function PhaseResults({ players, state }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate pt="Quantos pontos você ganhou?" en="How many points did you get?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          clover={state.clover}
          leaves={state.leaves}
          ranking={state.ranking}
          activeCloverId={state.activeCloverId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
