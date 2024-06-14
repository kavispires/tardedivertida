import clsx from 'clsx';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { App, Space, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// API & Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
// Images
import avatars from 'assets/images/avatars.svg';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Services
import { ADMIN_API, ADMIN_API_ACTIONS } from 'services/adapters';
// Components
import { Translate } from 'components/language';
import { HostButton, HostOnlyContainer } from 'components/host';

type StepWaitingProps = {
  players: GamePlayers;
};

export function StepWaiting({ players }: StepWaitingProps) {
  const { message, notification } = App.useApp();
  const { gameId, gameName } = useGameMeta();
  const { translate } = useLanguage();
  const { isLoading, setLoader } = useLoading();

  const gameMeta = useGameMeta();

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const { mutate, isPending: isLocking } = useMutation({
    mutationKey: ['lock-game'],
    mutationFn: async () => {
      setLoader('lock-game', true);
      return await ADMIN_API.run({
        action: ADMIN_API_ACTIONS.LOCK_GAME,
        gameId,
        gameName,
      });
    },
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

  useEffect(() => {
    setLoader('lock-game', isLocking);

    return () => {
      setLoader('lock-game', false);
    };
  }, [isLocking]); // eslint-disable-line

  const numPlayers = Object.keys(players).length;

  return (
    <>
      <h1 className={clsx('lobby-step__title', getAnimationClass('tada'))}>
        {username || translate('Fulano', 'Unknown')}
      </h1>

      <Space className="space-container">
        <svg viewBox="0 0 100 100" className="lobby-avatar">
          <use href={avatars + `#avatar-${userAvatarId}`}></use>
        </svg>
      </Space>

      <h3 className="lobby-heading">
        <Translate pt="Aguarde os outros jogadores entrarem." en="Please, wait while other players join..." />
      </h3>
      <HostOnlyContainer className="lobby-waiting__lock-button" direction="vertical">
        <Typography.Text className="center padding">
          <Translate pt="Jogadores necessários" en="Players needed" />: {numPlayers}/{gameMeta.min}
        </Typography.Text>
        <HostButton
          onClick={() => mutate()}
          disabled={isLoading || numPlayers < gameMeta.min}
          loading={isLoading}
          block
        >
          <Translate pt="Trancar e Iniciar Jogo" en="Lock and Start Game" />
        </HostButton>
      </HostOnlyContainer>
    </>
  );
}
