import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GameState } from 'types/game';
// Utils
import { print } from 'utils/helpers';
// Internal
import { useFirestoreDocument } from './useFirestoreDocument';

export function useGameState(gameId: GameId, gameName: GameName): GameState {
  const { notification } = App.useApp();
  const docPath = `games/${gameName}/${gameId}/state`;

  const { isLoading, isRefetching, isError, error, data } = useFirestoreDocument(docPath, true);

  if (isError) {
    notification.error({
      title: 'The application found an error while trying to update the game state',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.error(error);
  }

  const state = data ?? {};

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to trigger this when the game state changes
  useEffect(() => {
    if (isLoading || isRefetching) {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.count('Refreshing state...');
    } else {
      print({ state });
    }
  }, [isLoading, isRefetching]);

  return state as GameState;
}
