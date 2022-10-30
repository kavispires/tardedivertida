// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepVote } from './StepVote';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { ChoiceIcon } from 'components/icons/ChoiceIcon';

function PhaseEvaluation({ players, state, info }: PhaseProps) {
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const { step, goToNextStep, setStep } = useStep(0);
  const [, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.EVALUATION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<ChoiceIcon />}
          title={<Translate pt="Vote!" en="Vote!" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={<>Vote no desenho que você acha que mais parece com o monstro meliante.</>}
              en={<>Vote for the sketch that best represents the monster.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVote
          isUserTheWitness={isUserTheWitness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          onSubmitVote={onSubmitVote}
          user={user}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseEvaluation;
