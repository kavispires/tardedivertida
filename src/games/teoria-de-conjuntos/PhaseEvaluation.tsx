// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitEvaluationAPIRequest } from './utils/api-requests';
import { Guess } from './utils/types';
import { StepEvaluate } from './StepEvaluate';
// Icons

export function PhaseEvaluation({ players, state }: PhaseProps) {
  const { step, setStep } = useStep();
  const user = useUser(players, state);
  const [judge, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);

  const currentGuess: Guess = state.currentGuess;

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TEORIA_DE_CONJUNTOS.EVALUATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepEvaluate
          players={players}
          user={user}
          examples={state.examples}
          diagrams={state.diagrams}
          items={state.items}
          turnOrder={state.turnOrder}
          activePlayer={activePlayer}
          onSubmitEvaluation={onSubmitEvaluation}
          judge={judge}
          isJudge={isTheJudge}
          currentGuess={currentGuess}
          solutions={state.solutions}
          targetItemCount={state.targetItemsCount}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
