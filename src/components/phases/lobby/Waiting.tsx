import { useCallback } from 'react';
// Ant Design Resources
import { Button, message, notification, Typography } from 'antd';
// API & Hooks
import { ADMIN_API } from 'services/adapters';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useGameMeta } from 'hooks/useGameMeta';
// Images
import avatars from 'assets/images/avatars.svg';
// Components
import { AdminOnlyContainer } from 'components/admin';
import { Translate } from 'components/language';
import { GameBanner } from '../../general/GameBanner';

type WaitingProps = {
  info: GameInfo;
  players: GamePlayers;
};

export function Waiting({ info, players }: WaitingProps) {
  const { gameId, gameName } = useGameMeta();
  const { translate } = useLanguage();
  const { isLoading, setLoader } = useLoading();

  const gameMeta = useGameMeta();

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const onLockGameAndStart = useCallback(async () => {
    try {
      setLoader('lock-game', true);
      const response: PlainObject = await ADMIN_API.lockGame({
        gameId,
        gameName,
      });
      if (response.data.isLocked) {
        message.success(
          translate('Jogo trancado e iniciado com sucesso!', 'Game locked and initialized successfully')
        );
      }
    } catch (e: any) {
      notification.error({
        message: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar trancar e iniciar o jogo',
          'Oops, the application found an error while trying to lock and start the game'
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('lock-game', false);
    }
  }, [gameId, gameName, setLoader, translate]);

  const numPlayers = Object.keys(players).length;
  return (
    <div className="lobby-waiting">
      <div className="lobby-waiting__card">
        <GameBanner title={info?.title} gameName={info?.gameName} className="lobby-banner" />

        <h1 className="lobby-heading">{username || 'Fulano'}</h1>

        <svg viewBox="0 0 100 100" className="lobby-avatar">
          <use href={avatars + `#avatar-${userAvatarId}`}></use>
        </svg>

        <h3 className="lobby-heading">
          <Translate
            pt="Aguarde os outros jogadores entrarem."
            en="Please, wait while other players join..."
          />
        </h3>
        <AdminOnlyContainer className="lobby-waiting__lock-button" direction="vertical">
          <Typography.Text className="center padding">
            <Translate pt="Jogadores necessários" en="Players needed" />: {numPlayers}/{gameMeta.min}
          </Typography.Text>
          <Button
            type="primary"
            danger
            onClick={onLockGameAndStart}
            disabled={isLoading || numPlayers < gameMeta.min}
            loading={isLoading}
            block
          >
            <Translate pt="Trancar e Iniciar Jogo" en="Lock and Start Game" />
          </Button>
        </AdminOnlyContainer>
      </div>
    </div>
  );
}
