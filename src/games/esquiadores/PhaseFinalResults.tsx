// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { LodgeIcon } from 'icons/LodgeIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseFinalResultsState } from './utils/types';
import { ESQUIADORES_PHASES } from './utils/constants';
import { SnowEffect } from '../../components/visual-effects/SnowEffect';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { StepBetsBreakdown } from './StepBetsBreakdown';
// Icons

export function PhaseFinalResults({ players, state, user }: PhaseProps<PhaseFinalResultsState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [skier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<LodgeIcon />}
      title={<Translate pt="E chegamos uma cabana!" en="We've reached a lodge!" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>...</Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ESQUIADORES_PHASES.FINAL_RESULTS}>
      <SnowEffect />
      <StepSwitcher step={step} players={players}>
        {/* Step 1 */}
        <StepResults
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          skier={skier}
          mountain={state.mountain}
          lodges={state.lodges}
          betType="final"
          animateFrom={state.animateFrom}
          animateTo={state.animateTo}
          goToNextStep={goToNextStep}
        />

        <StepBetsBreakdown
          players={players}
          skier={skier}
          lodges={state.lodges}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
        />

        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
