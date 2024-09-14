import { App } from 'antd';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// Types
import type { GameMeta } from 'types/game';
// Services
import { GAME_API, GAME_API_COMMON_ACTIONS, HOST_API, HOST_API_ACTIONS } from 'services/adapters';
// Hooks
import { useCurrentUserContext } from './useCurrentUserContext';

type GameMetaResponse = {
  data: GameMeta;
};

export function useRedirectToNewGame() {
  const { notification } = App.useApp();
  const { currentUser } = useCurrentUserContext();
  const [happenedOnce, setHappenedOnce] = useState(false);
  const [newGame, setNewGame] = useState({
    gameId: '',
    gameName: '',
  });

  const mutation = useMutation<unknown, Error, PlainObject, unknown>({
    mutationKey: ['oldState', newGame.gameId],
    mutationFn: async ({ prevGameId, payload }) => {
      const metaResponse = (await GAME_API.run({
        action: GAME_API_COMMON_ACTIONS.LOAD_GAME,
        gameId: prevGameId,
      })) as GameMetaResponse;

      const meta = metaResponse.data;

      return await HOST_API.run({
        gameId: prevGameId,
        gameName: meta?.gameName ?? '',
        playerId: currentUser.id,
        action: HOST_API_ACTIONS.FORCE_STATE_PROPERTY,
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

  const startRedirect = async (prevGameId: GameId, newGameId: GameId, newGameName: GameName) => {
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

    await mutation.mutateAsync({
      prevGameId,
      gameName: newGameName,
      payload: {
        redirect: {
          redirectAt: Date.now(),
          gameId: newGameId,
          gameName: newGameName,
        },
      },
    });
    setHappenedOnce(true);
  };

  return {
    isSettingRedirect: mutation.isPending,
    startRedirect,
    wasRedirectSuccessful: mutation.isSuccess,
  };
}
