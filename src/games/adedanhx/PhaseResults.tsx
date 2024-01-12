import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepRanking } from './StepRanking';
import { StepResultGrid } from './StepResultGrid';
import { ScoringRule } from './components/RulesBlobs';

export function PhaseResults({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ADEDANHX.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResultGrid
          players={players}
          user={user}
          announcement={announcement}
          grid={state.grid}
          answersGrid={state.answersGrid}
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
