// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitEvaluationAPIRequest } from './utils/api-requests';
// Icons
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseContainer } from 'components/phases';
import { Guess } from './utils/types';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { StepEvaluate } from './StepEvaluate';

export function PhaseEvaluation({ players, state, info }: PhaseProps) {
  const { step, setStep } = useStep();
  const user = useUser(players, state);
  const [judge, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);

  const currentGuess: Guess = state.currentGuess;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TEORIA_DE_CONJUNTOS.EVALUATION}>
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
