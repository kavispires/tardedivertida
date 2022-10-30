import { useEffect, useState } from 'react';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepReveal } from './StepReveal';
import { ScoringMessage } from './components/RulesBlobs';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RankIcon } from 'components/icons/RankIcon';
import { Translate } from 'components/language';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players, state);

  const [isFirstRunThrough, setIsFirstRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstRunThrough && step > 1) {
      setIsFirstRunThrough(false);
    }
  }, [step, isFirstRunThrough]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.REVEAL}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <ScoringMessage round={state.round} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          players={players}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          onSeeRanking={goToNextStep}
          round={state.round}
          results={state.results}
          isFirstRunThrough={isFirstRunThrough}
        />

        {/* Step 2 */}
        <StepRanking
          ranking={state.ranking}
          players={players}
          goToPreviousStep={goToPreviousStep}
          round={state.round}
          lastRound={state?.lastRound}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
