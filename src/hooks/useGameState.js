import { notification } from 'antd';
import { useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
// Services
import { firestore } from '../services/firebase';
// Hooks
import { useLoading } from './useLoading';

export function useGameState(gameId, gameName) {
  const [snapshot, loading, error] = useDocument(firestore.doc(`${gameName}/${gameId}/session/state`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [, setLoader] = useLoading();

  useEffect(() => {
    setLoader('state', loading);
    if (loading) console.log(`Loading state for ${gameName}...`);
  }, [loading, setLoader, gameName]);

  if (error) {
    notification.error({
      message: 'Aplicativo encontrou um erro ao tentar atualizar o estado',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
  }

  console.log({ snapshot });

  return snapshot.data();
}
