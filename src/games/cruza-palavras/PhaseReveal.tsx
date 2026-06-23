// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { RankIcon } from '@icons/RankIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { CRUZA_PALAVRAS_PHASES } from './utils/constants';
import type { PhaseRevealState } from './utils/types';
import { ScoringRule } from './components/RulesBlobs';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';

export function PhaseReveal({ state, players, user }: PhaseProps<PhaseRevealState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const playerCount = Object.keys(players).length;

  const announcement = (
    <PhaseAnnouncement
      icon={<RankIcon />}
      title={
        <Translate
          pt="Resultado"
          en="Results"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <ScoringRule playerCount={playerCount} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CRUZA_PALAVRAS_PHASES.REVEAL}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepReveal
          user={user}
          grid={state.grid}
          gridType={state.gameType}
          clues={state.clues}
          goToNextStep={goToNextStep}
          players={players}
          whoGotNoPoints={state.whoGotNoPoints ?? []}
          announcement={announcement}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          playerCount={playerCount}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
