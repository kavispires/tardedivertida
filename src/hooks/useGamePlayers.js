import { notification } from 'antd';
import { useDocument } from 'react-firebase-hooks/firestore';
// Services
import { firestore } from '../services/firebase';

export function useGamePlayers(gameId, gameName) {
  const [snapshot, loading, error] = useDocument(firestore.doc(`${gameName}/${gameId}/session/players`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    notification.error({
      message: 'Applicativo encontrou um erro ao tentar atualizar os jogadores',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  if (loading) {
    console.log('%cRefreshing players...', 'color:orange');
  }

  return snapshot?.data() ?? {};
}
