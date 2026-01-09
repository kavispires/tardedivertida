// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { TREVO_DA_SORTE_PHASES } from './utils/constants';
import { StepRanking } from './StepRanking';

export function PhaseResults({ state, players }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TREVO_DA_SORTE_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={
            <Translate
              pt="Resultado"
              en="Results"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate
              pt="Quantos pontos você ganhou?"
              en="How many points did you get?"
            />
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
