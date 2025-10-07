import { useEffect, useState } from 'react';
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
import { ADEDANHX_PHASES } from './utils/constants';
import { ScoringRule } from './components/RulesBlobs';
import { StepRanking } from './StepRanking';
import { StepResultGrid } from './StepResultGrid';

export function PhaseResults({ players, state, user }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [isFirstRunThrough, setIsFirstRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstRunThrough && step > 0) {
      setIsFirstRunThrough(false);
    }
  }, [step, isFirstRunThrough]);

  const announcement = (
    <PhaseAnnouncement
      icon={<RankIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <ScoringRule />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ADEDANHX_PHASES.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResultGrid
          players={players}
          user={user}
          announcement={announcement}
          grid={state.grid}
          answersGrid={state.answersGrid}
          answersGroups={state.answersGroups}
          goToNextStep={goToNextStep}
        />

        <StepRanking
          ranking={state.ranking}
          players={players}
          goToPreviousStep={goToPreviousStep}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
