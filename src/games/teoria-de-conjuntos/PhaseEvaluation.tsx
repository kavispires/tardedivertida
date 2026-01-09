// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Components
import { PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitEvaluationAPIRequest } from './utils/api-requests';
import type { Guess } from './utils/types';
import { TEORIA_DE_CONJUNTOS_PHASES } from './utils/constants';
import { StepEvaluate } from './StepEvaluate';

export function PhaseEvaluation({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();

  const [judge, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);

  const currentGuess: Guess = state.currentGuess;

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TEORIA_DE_CONJUNTOS_PHASES.EVALUATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
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
