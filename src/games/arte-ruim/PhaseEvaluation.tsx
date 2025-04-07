// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ViewIf } from 'components/views';
// Internal
import { useOnSubmitVotingAPIRequest } from './utils/api-requests';
import { ARTE_RUIM_PHASES } from './utils/constants';
import { EvaluationRules } from './components/TextBlobs';
import { EvaluatedDrawings } from './components/EvaluatedDrawings';
import { StepEvaluation } from './StepEvaluation';

function EvaluationPhase({ players, state }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitVoting = useOnSubmitVotingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={<Translate pt="Adivinhação" en="Match the Pairs" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <EvaluationRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ARTE_RUIM_PHASES.EVALUATION}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          instruction: (
            <Translate
              pt="Vamos aguardar enquanto os outros jogadores terminam de avaliar!"
              en="Please wait while other players finish their evaluations!"
            />
          ),
          content: (
            <EvaluatedDrawings
              cards={state.cards}
              drawings={state.drawings}
              votes={user?.votes}
              players={players}
            />
          ),
        }}
      >
        {/*Step 0 */}
        <ViewIf condition={state.drawings && user.id}>
          <StepEvaluation
            drawings={state.drawings}
            cards={state.cards}
            players={players}
            onSubmitVoting={onSubmitVoting}
            levelType={state.levelType}
            announcement={announcement}
            user={user}
          />
        </ViewIf>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default EvaluationPhase;
