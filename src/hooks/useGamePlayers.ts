import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { print } from 'utils/helpers';
// Internal
import { useFirestoreDocument } from './useFirestoreDocument';

export function useGamePlayers(gameId: GameId, gameName: GameName): GamePlayers {
  const docPath = `games/${gameName}/${gameId}/players`;
  const { notification } = App.useApp();

  const { isLoading, isRefetching, isError, error, data } = useFirestoreDocument(docPath, true);

  if (isError) {
    notification.error({
      message: 'The application found an error while trying to update the players document',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  const players = data ?? {};

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isLoading || isRefetching) {
      console.count('Refreshing players...');
    } else {
      print(players, 'table');
    }
  }, [isLoading, isRefetching]);

  return players as GamePlayers;
}
