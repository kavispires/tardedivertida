import { notification } from 'antd';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
// Services
import { firestore } from 'services/firebase';

export function useGamePlayers(gameId: GameId, gameName: GameName): Players | {} {
  const docPath = `games/${gameName}/${gameId}/players`;
  const [snapshot, loading, error] = useDocument(doc(firestore, docPath), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    notification.error({
      message: 'The application found an error while trying to update the players document',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
    console.error(error);
  }

  if (loading) {
    console.count('Refreshing players...');
  }

  return snapshot?.data() ?? {};
}
