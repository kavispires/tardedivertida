import { useEffect } from 'react';
// Ant Design Resources
import { notification } from 'antd';
// Hooks
import { useFirestoreDocument } from './useFirestoreDocument';
// Utils
import { print } from 'utils/helpers';

export function useGameState(gameId: GameId, gameName: GameName): GameState {
  const docPath = `games/${gameName}/${gameId}/state`;

  const { isLoading, isRefetching, isError, error, data } = useFirestoreDocument(docPath, true);

  if (isError) {
    notification.error({
      message: 'The application found an error while trying to update the game state',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  const state = data ?? {};

  useEffect(() => {
    if (isLoading || isRefetching) {
      console.count('Refreshing state...');
    } else {
      print({ state });
    }
  }, [isLoading, isRefetching]); // eslint-disable-line

  return state as GameState;
}
