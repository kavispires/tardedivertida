import { notification } from 'antd';
import { useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
// Services
import { firestore } from '../services/firebase';
// Hooks
import { useLoading } from './useLoading';

export function useGameInfo(gameId, gameName) {
  const [snapshot, loading, error] = useDocument(firestore.doc(`${gameName}/${gameId}/session/info`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  // const [, setLoader] = useLoading();

  // useEffect(() => {
  //   setLoader('info', loading);
  // }, [loading]);

  if (error) {
    notification.error({
      message: 'Applicativo encontrou um erro ao tentar atualizar a sessão',
      description: JSON.stringify(error),
      placement: 'bottomLeft',
    });
  }

  console.log({ snapshot });

  return snapshot.data();
}
