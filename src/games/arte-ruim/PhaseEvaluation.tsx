// Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
import { useOnSubmitVotingAPIRequest } from './api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { StepEvaluation } from './StepEvaluation';
import { EvaluationRules } from './TextBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function EvaluationPhase({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const isUserReady = useIsUserReady(players, state);
  const onSubmitVoting = useOnSubmitVotingAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.EVALUATION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam de avaliar!',
          'Please wait while other players finish their evaluations!'
        )}
      >
        {/*Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Adivinhação', 'Match the Pairs')}
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
