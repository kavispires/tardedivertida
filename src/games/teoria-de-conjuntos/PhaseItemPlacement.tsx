// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitItemPlacementAPIRequest } from './utils/api-requests';
// Icons
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseContainer } from 'components/phases';
import { Guess } from './utils/types';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { Announcement } from './components/Announcement';
import { StepPlaceItem } from './StepPlaceItem';
import { useUser } from 'hooks/useUser';
import { ViewOr } from 'components/views';
import { StepWaitPlaceItem } from './StepWaitPlaceItem';

export function PhaseItemPlacement({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TEORIA_DE_CONJUNTOS.ITEM_PLACEMENT}>
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
