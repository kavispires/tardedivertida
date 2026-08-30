// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Components
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseCardResolutionState } from './utils/types';
import { CORREIO_DO_AMOR_PHASES } from './utils/constants';
import { StepDisplayResults } from './StepDisplayResults';

export function PhaseCardResolution({ players, state, user }: PhaseProps<PhaseCardResolutionState>) {
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CORREIO_DO_AMOR_PHASES.CARD_RESOLUTION}
    >
      <StepSwitcher
        step={0}
        players={players}
      >
        {/* Step 1 */}
        <StepDisplayResults
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
          targetPlayersIds={state.targetPlayersIds}
          outcome={state.outcome}
          activePlayer={activePlayer}
          deck={state.deck}
          ongoingEffects={state.ongoingEffects}
          log={state.log}
          newCardsInDeck={state.newCardsInDeck}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
