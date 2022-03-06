// State & Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';
import StepReveal from './StepReveal';
import { ScoringRule } from './RulesBlobs';
import { StepRanking } from './StepRanking';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep, previousStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const playerCount = Object.keys(players).length;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Resultado', 'Results')}
          onClose={nextStep}
          currentRound={state?.round?.current}
        >
          <ScoringRule playerCount={playerCount} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          user={user}
          grid={state.grid}
          clues={state.clues}
          nextStep={nextStep}
          players={players}
          whoGotNoPoints={state.whoGotNoPoints ?? []}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          playerCount={playerCount}
          round={state.round}
          ranking={state.ranking}
          previousStep={previousStep}
          isLastRound={state?.lastRound}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
