// Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitVotingAPIRequest } from './utils/api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { StepEvaluation } from './StepEvaluation';
import { EvaluationRules } from './components/TextBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { EvaluatedDrawings } from './components/EvaluatedDrawings';
import { EvaluateIcon } from 'components/icons/EvaluateIcon';
import { Translate } from 'components/language';

function EvaluationPhase({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitVoting = useOnSubmitVotingAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.EVALUATION}>
      <StepSwitcher
        step={step}
        conditions={[!user.isReady, !user.isReady]}
        players={players}
        waitingRoomInstruction={
          <Translate
            pt="Vamos aguardar enquanto os outros jogadores terminam de avaliar!"
            en="Please wait while other players finish their evaluations!"
          />
        }
        waitingRoomContent={
          <EvaluatedDrawings cards={state.cards} drawings={state.drawings} votes={user?.votes} />
        }
      >
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<EvaluateIcon />}
          title={<Translate pt="Adivinhação" en="Match the Pairs" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <EvaluationRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepEvaluation
          drawings={state.drawings}
          cards={state.cards}
          players={players}
          onSubmitVoting={onSubmitVoting}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default EvaluationPhase;
