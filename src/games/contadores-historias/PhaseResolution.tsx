import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, Step, StepSwitcher } from '../../components';
import { StepResolution } from './StepResolution';
import { StepRanking } from './StepRanking';
import { ScoringRules } from './RulesBlogs';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [storyteller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.RESOLUTION}
      className="c-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="seal"
          title={translate('Solução', 'Solution')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <ScoringRules storyteller={storyteller} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepResolution
            players={players}
            story={state.story}
            storyteller={storyteller}
            table={state.table}
            setStep={setStep}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <StepRanking
            players={players}
            ranking={state.ranking}
            outcome={state.outcome}
            storyteller={storyteller}
            round={state.round}
            lastRound={state.lastRound}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
