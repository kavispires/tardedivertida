// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { QualitySealIcon } from 'components/icons/QualitySealIcon';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [witness] = useWhichPlayerIsThe('witnessId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<QualitySealIcon />}
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
        <StepRanking
          ranking={state.ranking}
          players={players}
          round={state.round}
          isLastRound={state?.lastRound}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
