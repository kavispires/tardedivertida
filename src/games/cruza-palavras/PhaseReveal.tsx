// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';
import { ScoringRule } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RankIcon } from 'components/icons/RankIcon';
import { Translate } from 'components/language';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const playerCount = Object.keys(players).length;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <ScoringRule playerCount={playerCount} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          user={user}
          grid={state.grid}
          clues={state.clues}
          goToNextStep={goToNextStep}
          players={players}
          whoGotNoPoints={state.whoGotNoPoints ?? []}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          playerCount={playerCount}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
          isLastRound={state?.lastRound}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
