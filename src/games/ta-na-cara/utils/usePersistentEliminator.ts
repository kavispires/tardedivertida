import { useMemo, useState } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Internal
import { useTaNaCaraStore } from './store';

export function usePersistentEliminator(gameId: GameId, players: GamePlayers) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId | null>(null);
  const selectedPlayer: GamePlayer | null = players[selectedPlayerId ?? ''];
  const { state, updatePlayerState } = useTaNaCaraStore(gameId);

  const toggleSelectedPlayerId = (playerId: PlayerId | null) => {
    setSelectedPlayerId((prev) => (prev === playerId ? null : playerId));
  };

  const toggleEliminatePersonForPlayer = selectedPlayer
    ? (suspectId: CardId) => {
        if (state.data?.[selectedPlayer.id]?.eliminated?.[suspectId]) {
          updatePlayerState(selectedPlayer.id, selectedPlayer.identity.identityId, { [suspectId]: false });
        } else {
          updatePlayerState(selectedPlayer.id, selectedPlayer.identity.identityId, { [suspectId]: true });
        }
      }
    : undefined;

  const selectedIdentityIds = useMemo(() => {
    return selectedPlayerId
      ? Object.keys(state.data?.[selectedPlayerId]?.eliminated ?? {})?.filter(
          (key) => state.data?.[selectedPlayerId]?.eliminated?.[key] === true,
        )
      : [];
  }, [selectedPlayerId, state.data]);

  return {
    selectedPlayer,
    toggleEliminatePersonForPlayer,
    toggleSelectedPlayerId,
    selectedIdentityIds,
    votes: state.data ?? {},
  };
}
