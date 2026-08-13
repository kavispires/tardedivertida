// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Components
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseCardEffectsState } from './utils/types';
import { CORREIO_DO_AMOR_PHASES } from './utils/constants';
import { useOnSubmitSelectionsAPIRequest } from './utils/api-requests';
import { StepMakeDecision } from './StepMakeDecision';

export function PhaseCardEffects({ players, state, user }: PhaseProps<PhaseCardEffectsState>) {
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitSelections = useOnSubmitSelectionsAPIRequest();

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CORREIO_DO_AMOR_PHASES.CARD_EFFECTS}
    >
      <StepSwitcher
        step={0}
        players={players}
      >
        {/* Step 1 */}
        <StepMakeDecision
          user={user}
          players={players}
          cardsDict={state.cardsDict}
          turnOrder={state.turnOrder}
          gameOrder={state.gameOrder}
          startingPlayerId={state.startingPlayerId}
          discardPile={state.discardPile}
          cardsSetAside={state.cardsSetAside}
          effectKeyword={state.effectKeyword}
          activePlayerId={state.activePlayerId}
          nextDrawnCardId={state.nextDrawnCardId}
          targetPlayersIds={state.targetPlayersIds}
          outcome={state.outcome}
          activePlayer={activePlayer}
          isTheActivePlayer={isTheActivePlayer}
          deck={state.deck}
          ongoingEffects={state.ongoingEffects}
          onSubmitSelections={onSubmitSelections}
          play={state.play}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
