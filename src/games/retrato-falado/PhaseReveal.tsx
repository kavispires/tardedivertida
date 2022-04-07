// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe, useUser, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [witness] = useWhichPlayerIsThe('witnessId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="quality-seal"
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate pt={<>E o mais votado é...</>} en={<>And the one who got the most votes is...</>} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResults
          witness={witness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          mostVotes={state.mostVotes}
          witnessVote={state.witnessVote}
          user={user}
          players={players}
          goToNextStep={goToNextStep}
        />

        {/* Step 2 */}
        <StepRanking ranking={state.ranking} players={players} round={state.round} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
