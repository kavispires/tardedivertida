import { notification } from 'antd';
import { useDocument } from 'react-firebase-hooks/firestore';
// Services
import { firestore } from '../services/firebase';

export function useGameInfo(gameId, gameName) {
  const [snapshot, loading, error] = useDocument(firestore.doc(`${gameName}/${gameId}/session/info`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    notification.error({
      message: 'Applicativo encontrou um erro ao tentar atualizar a sessão',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
  }

  if (loading) {
    console.log('%cRefreshing info...', 'color:orange');
  }

  return snapshot?.data() ?? {};
}
