import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { App } from 'antd';
// Services
import { GAME_API, GAME_API_COMMON_ACTIONS } from 'services/adapters';
// Utils
import { getRandomWelcomeMessage, speak } from 'utils/speech';
// Internal
import { useGameMeta } from './useGameMeta';
import { useGlobalState } from './useGlobalState';
import { useLanguage } from './useLanguage';
import { getKey, useGlobalLocalStorage } from './useGlobalLocalStorage';

export function useAddPlayer(name: string, avatarId: string, isGuest: boolean, onSuccess: GenericFunction) {
  const { gameId, gameName } = useGameMeta();
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [volume] = useGlobalLocalStorage('volume');
  const { language, translate } = useLanguage();
  const { notification } = App.useApp();

  const query = useMutation({
    mutationKey: ['add-player'],
    mutationFn: async () =>
      await GAME_API.run({
        action: GAME_API_COMMON_ACTIONS.JOIN_GAME,
        gameId,
        gameName,
        playerName: name,
        playerAvatarId: avatarId,
        isGuest,
      }),
    onSuccess: (response) => {
      const data = response.data as PlainObject;
      setUserId(data.id);
      setUsername(data.name);
      setUserAvatarId(data.avatarId);

      localStorage.setItem(getKey('username'), data.name);
      localStorage.setItem(getKey('avatarId'), data.avatarId);
      localStorage.setItem(getKey('gameId'), gameId);

      if (volume) {
        speak(getRandomWelcomeMessage(name ?? translate('vei', 'babe')), language, volume);
      }

      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar te adicionar como jogador',
          'Oops, the application failed when trying to add you as a player',
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });

      // biome-ignore lint/suspicious/noConsole: we want to log errors for debugging purposes
      console.error(e);
    },
  });

  return query;
}
