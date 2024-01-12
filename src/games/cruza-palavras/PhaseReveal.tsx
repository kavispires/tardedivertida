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
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';
import { ScoringRule } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';

export function PhaseReveal({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players, state);

  const playerCount = Object.keys(players).length;

  const announcement = (
    <PhaseAnnouncement
      icon={<RankIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <ScoringRule playerCount={playerCount} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.REVEAL}>
      <StepSwitcher step={step} players={players}>
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
