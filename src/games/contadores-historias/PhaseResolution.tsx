// Hooks
import { useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';
import { StepResolution } from './StepResolution';
import { StepRanking } from './StepRanking';
import { ScoringRules } from './RulesBlogs';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep, previousStep } = useStep(0);
  const [storyteller] = useWhichPlayerIsThe('storytellerId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="seal"
          title={translate('Solução', 'Solution')}
          onClose={nextStep}
          currentRound={state?.round?.current}
        >
          <ScoringRules storyteller={storyteller} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResolution
          players={players}
          story={state.story}
          storyteller={storyteller}
          table={state.table}
          nextStep={nextStep}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          outcome={state.outcome}
          storyteller={storyteller}
          round={state.round}
          lastRound={state.lastRound}
          previousStep={previousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
