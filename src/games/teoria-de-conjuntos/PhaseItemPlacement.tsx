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
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitItemPlacementAPIRequest } from './utils/api-requests';
import type { Guess } from './utils/types';
import { Announcement } from './components/Announcement';
import { StepPlaceItem } from './StepPlaceItem';
import { StepWaitPlaceItem } from './StepWaitPlaceItem';
// Icons

export function PhaseItemPlacement({ players, state }: PhaseProps) {
  const { step, setStep } = useStep();
  const user = useUser(players, state);
  const [, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [previousActivePlayer] = useWhichPlayerIsThe('previousActivePlayerId', state, players);

  const onSubmitItemPlacement = useOnSubmitItemPlacementAPIRequest(setStep);

  const previousGuess: Guess | null = state.previousGuess;

  const announcement = (
    <Announcement
      activePlayer={activePlayer}
      previousGuess={previousGuess}
      currentRound={state.round.current}
      items={state.items}
      isTheActivePlayer={isTheActivePlayer}
      previousActivePlayer={previousActivePlayer}
      judgeId={state.judgeId}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TEORIA_DE_CONJUNTOS.ITEM_PLACEMENT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isTheActivePlayer}>
          <StepPlaceItem
            players={players}
            user={user}
            examples={state.examples}
            diagrams={state.diagrams}
            items={state.items}
            turnOrder={state.turnOrder}
            activePlayer={activePlayer}
            onSubmitItemPlacement={onSubmitItemPlacement}
            announcement={announcement}
            targetItemCount={state.targetItemsCount}
            round={state.round}
            isJudge={isTheJudge}
            solutions={state.solutions}
          />

          <StepWaitPlaceItem
            players={players}
            user={user}
            examples={state.examples}
            diagrams={state.diagrams}
            items={state.items}
            turnOrder={state.turnOrder}
            activePlayer={activePlayer}
            announcement={announcement}
            isJudge={isTheJudge}
            solutions={state.solutions}
            targetItemCount={state.targetItemsCount}
            round={state.round}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
