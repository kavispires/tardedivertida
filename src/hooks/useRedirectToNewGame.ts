import { App } from 'antd';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { GAME_API } from 'services/adapters';
import { ADMIN_API } from 'services/adapters';
import { useCurrentUserContext } from './useCurrentUserContext';
import { ADMIN_ACTIONS } from 'utils/constants';

type GameMetaResponse = {
  data: GameMeta;
};

export function useRedirectToNewGame() {
  const { notification } = App.useApp();
  const { currentUser } = useCurrentUserContext();
  const [happenedOnce, setHappenedOnce] = useState(false);
  const [previousGameId, setPreviousGameId] = useState('');
  const [newGame, setNewGame] = useState({
    gameId: '',
    gameName: '',
  });

  const metaQuery = useQuery<GameMetaResponse>({
    queryKey: ['meta', previousGameId],
    queryFn: async () => {
      console.count('Fetching game meta...');
      return (await GAME_API.loadGame({ gameId: previousGameId })) as GameMetaResponse;
    },
    enabled: Boolean(previousGameId),
    onError: (e: any) => {
      console.error(e);
      notification.error({
        message: 'Failed to load previous game to trigger the redirect',
        description: JSON.stringify(e.message),
      });
    },
  });

  const mutation = useMutation({
    mutationKey: ['oldState', newGame.gameId],
    mutationFn: async (payload: {}) => {
      const meta = metaQuery.data?.data as GameMeta;

      return await ADMIN_API.performAdminAction({
        gameId: previousGameId,
        gameName: meta?.gameName ?? '',
        playerId: currentUser.id,
        action: ADMIN_ACTIONS.FORCE_STATE_PROPERTY,
        state: payload,
      });
    },
    onSuccess: async () => {
      notification.success({
        message: 'Redirect successfully triggered',
      });
    },
    onError: (e: any) => {
      console.error(e);
      notification.error({
        message: 'Failed to load previous game to continue the redirect',
        description: JSON.stringify(e.message),
      });
    },
  });

  useEffect(() => {
    if (
      !happenedOnce &&
      previousGameId &&
      newGame.gameId &&
      newGame.gameName &&
      metaQuery.isSuccess &&
      metaQuery?.data?.data?.gameName
    ) {
      setHappenedOnce(true);
      mutation.mutate({
        redirect: {
          redirectAt: Date.now(),
          ...newGame,
        },
      });
    }
  }, [previousGameId, happenedOnce, newGame, metaQuery?.data?.data?.gameName, metaQuery.isSuccess, mutation]);

  const startRedirect = async (previousGameId: GameId, newGameId: GameId, newGameName: GameName) => {
    if (happenedOnce) {
      notification.error({
        message: 'Redirect has failed to trigger',
      });
      return;
    }
    setNewGame({
      gameId: newGameId,
      gameName: newGameName,
    });
    setPreviousGameId(previousGameId);
  };

  return {
    isSettingRedirect: metaQuery.isLoading && mutation.isLoading,
    startRedirect,
    wasRedirectSuccessful: mutation.isSuccess,
  };
}
