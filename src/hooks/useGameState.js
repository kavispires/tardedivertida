import { notification } from 'antd';
import { useDocument } from 'react-firebase-hooks/firestore';
// Services
import { firestore } from '../services/firebase';

export function useGameState(gameId, gameName) {
  const [snapshot, loading, error] = useDocument(firestore.doc(`${gameName}/${gameId}/session/state`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    notification.error({
      message: 'Aplicativo encontrou um erro ao tentar atualizar o estado',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  if (loading) {
    console.log('%cRefreshing state...', 'color:tomato');
  }

  return snapshot?.data() ?? {};
}
