import { useQuery } from 'react-query';
// Ant Design Resources
import { Space, Typography, message, notification } from 'antd';
// API & Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
// Images
import avatars from 'assets/images/avatars.svg';
// Services
import { ADMIN_API } from 'services/adapters';
// Components
import { Translate } from 'components/language';
import { VIPButton, VIPOnlyContainer } from 'components/vip';

type StepWaitingProps = {
  players: GamePlayers;
};

export function StepWaiting({ players }: StepWaitingProps) {
  const { gameId, gameName } = useGameMeta();
  const { translate } = useLanguage();
  const { isLoading, setLoader } = useLoading();

  const gameMeta = useGameMeta();

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const { refetch } = useQuery({
    queryKey: 'add-player',
    queryFn: async () => {
      setLoader('lock-game', true);
      return await ADMIN_API.lockGame({
        gameId,
        gameName,
      });
    },
    enabled: false,
    onSuccess: (response) => {
      const data = response.data as PlainObject;

      if (data.isLocked) {
        message.success(
          translate('Jogo trancado e iniciado com sucesso!', 'Game locked and initialized successfully')
        );
      }
    },
    onError: (e: any) => {
      notification.error({
        message: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar trancar e iniciar o jogo',
          'Oops, the application found an error while trying to lock and start the game'
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    },
    onSettled: () => {
      setLoader('lock-game', false);
    },
  });

  const numPlayers = Object.keys(players).length;

  return (
    <>
      <h1 className="lobby-step__title">{username || translate('Fulano', 'Unknown')}</h1>

      <Space className="space-container">
        <svg viewBox="0 0 100 100" className="lobby-avatar">
          <use href={avatars + `#avatar-${userAvatarId}`}></use>
        </svg>
      </Space>

      <h3 className="lobby-heading">
        <Translate pt="Aguarde os outros jogadores entrarem." en="Please, wait while other players join..." />
      </h3>
      <VIPOnlyContainer className="lobby-waiting__lock-button" direction="vertical">
        <Typography.Text className="center padding">
          <Translate pt="Jogadores necessários" en="Players needed" />: {numPlayers}/{gameMeta.min}
        </Typography.Text>
        <VIPButton
          onClick={() => refetch()}
          disabled={isLoading || numPlayers < gameMeta.min}
          loading={isLoading}
          block
        >
          <Translate pt="Trancar e Iniciar Jogo" en="Lock and Start Game" />
        </VIPButton>
      </VIPOnlyContainer>
    </>
  );
}
