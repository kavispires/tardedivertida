// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { SealIcon } from 'icons/SealIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { ScoringRules } from './components/RulesBlobs';
import { StepResolution } from './StepResolution';
import { StepRanking } from './StepRanking';

export function PhaseResolution({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [storyteller] = useWhichPlayerIsThe('storytellerId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SealIcon />}
      title={<Translate pt="Solução" en="Solution" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <ScoringRules storyteller={storyteller} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResolution
          players={players}
          story={state.story}
          storyteller={storyteller}
          table={state.table}
          goToNextStep={goToNextStep}
          announcement={announcement}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          outcome={state.outcome}
          storyteller={storyteller}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
