// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { RankIcon } from 'components/icons/RankIcon';
import { StepRanking } from './StepRanking';

function PhaseResults({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.RESULTS}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate pt="Quantos pontos você ganhou?" en="How many points did you get?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          clover={state.clover}
          leaves={state.leaves}
          ranking={state.ranking}
          lastRound={state.lastRound}
          activeCloverId={state.activeCloverId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResults;
