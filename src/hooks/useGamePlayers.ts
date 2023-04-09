import { useEffect } from 'react';
// Ant Design Resources
import { notification } from 'antd';
// Hooks
import { useFirestoreDocument } from './useFirestoreDocument';
// Utils
import { isDevEnv } from 'utils/helpers';

export function useGamePlayers(gameId: GameId, gameName: GameName): GamePlayers {
  const docPath = `games/${gameName}/${gameId}/players`;

  const { isLoading, isError, error, data } = useFirestoreDocument(docPath, true);

  if (isError) {
    notification.error({
      message: 'The application found an error while trying to update the players document',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  const players = data ?? {};

  useEffect(() => {
    if (isLoading) {
      console.count('Refreshing players...');
    } else {
      if (isDevEnv) {
        console.table(players);
      }
    }
  }, [isLoading]); // eslint-disable-line

  return players as GamePlayers;
}
