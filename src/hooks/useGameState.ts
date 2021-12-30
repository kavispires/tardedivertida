import { notification } from 'antd';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
// Services
import { firestore } from '../services/firebase';

export function useGameState(gameId: GameId, gameName: GameName): GameState {
  const docPath = `${gameName}/${gameId}/session/state`;
  const [snapshot, loading, error] = useDocument(doc(firestore, docPath), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    notification.error({
      message: 'The application found an error while trying to update the game state',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  if (loading) {
    console.log('%cRefreshing state...', 'color:tomato');
  }

  return snapshot?.data() as GameState;
}
