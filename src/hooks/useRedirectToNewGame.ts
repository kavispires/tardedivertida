import { App } from 'antd';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
// Types
import type { GameMeta } from 'types/game';
// Services
import { ADMIN_API, GAME_API, GAME_API_ACTIONS } from 'services/adapters';
// Utils
import { ADMIN_ACTIONS } from 'utils/constants';
// Hooks
import { useCurrentUserContext } from './useCurrentUserContext';

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
      return (await GAME_API.run({
        action: GAME_API_ACTIONS.LOAD_GAME,
        gameId: previousGameId,
      })) as GameMetaResponse;
    },
    enabled: Boolean(previousGameId),
  });

  useEffect(() => {
    if (metaQuery.isError) {
      console.error(metaQuery.error);
      notification.error({
        message: 'Failed to load previous game to trigger the redirect',
        description: JSON.stringify(metaQuery.error.message),
      });
    }
  }, [metaQuery.isError]); // eslint-disable-line

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
    setHappenedOnce(true);
    mutation.mutate({
      redirect: {
        redirectAt: Date.now(),
        gameId: newGameId,
        gameName: newGameName,
      },
    });
  };

  return {
    isSettingRedirect: metaQuery.isLoading && mutation.isPending,
    startRedirect,
    wasRedirectSuccessful: mutation.isSuccess,
  };
}
