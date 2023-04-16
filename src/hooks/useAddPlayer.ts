import { notification } from 'antd';
import { useQuery } from 'react-query';
// Services
import localStorage from 'services/localStorage';
import { GAME_API } from 'services/adapters';
// Hooks
import { useGameMeta } from './useGameMeta';
import { useGlobalState } from './useGlobalState';
import { useLanguage } from './useLanguage';
// Utils
import { getRandomWelcomeMessage, speak } from 'utils/speech';

export function useAddPlayer(name: string, avatarId: string, onSuccess: GenericFunction) {
  const { gameId, gameName } = useGameMeta();
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [volume] = useGlobalState('volume');
  const { language, translate } = useLanguage();

  const query = useQuery({
    queryKey: 'add-player',
    queryFn: async () =>
      await GAME_API.addPlayer({
        gameId,
        gameName,
        playerName: name,
        playerAvatarId: avatarId,
      }),
    enabled: false,
    onSuccess: (response) => {
      const data = response.data as PlainObject;
      console.log(data);
      setUserId(data.id);
      setUsername(data.name);
      setUserAvatarId(data.avatarId);

      localStorage.set({
        username: data.name,
        avatarId: data.avatarId,
        gameId,
      });

      if (volume) {
        speak(getRandomWelcomeMessage(name ?? translate('vei', 'babe')), language, volume);
      }

      onSuccess();
    },
    onError: (e: any) => {
      notification.error({
        message: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar te adicionar como jogador',
          'Oops, the application failed when trying to add you as a player'
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    },
  });

  return query;
}
