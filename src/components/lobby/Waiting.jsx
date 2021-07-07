import React, { useCallback } from 'react';
// Design Resources
import { Button, Image, message, notification, Typography } from 'antd';
// API & Hooks
import { GAME_API } from '../../adapters';
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';
// Images
import avatars from '../../images/avatars.svg';
// Utils and Resources
import { PUBLIC_URL } from '../../utils/constants';
// Components
import { AdminOnly } from '../admin/index';

function Waiting({ info, players }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [gameMeta] = useGlobalState('gameMeta');

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const onLockGameAndStart = useCallback(async () => {
    try {
      setLoader('lock-game', true);
      const response = await GAME_API.lockGame({
        gameId,
        gameName,
      });
      if (response.data.isLocked) {
        message.success('Jogo trancado e iniciado com sucesso!');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar trancar e iniciar o jogo',
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('lock-game', false);
    }
  }, [gameId, gameName, setLoader]);

  const numPlayers = Object.keys(players).length;

  return (
    <div className="lobby-waiting">
      <Image
        alt={info?.title}
        src={`${PUBLIC_URL.BANNERS}game-image-${info?.gameName}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
      />

      <h1 className="center">{username || 'Fulano'},</h1>
      <svg viewBox="0 0 100 100" className="lobby-waiting__avatar">
        <use href={avatars + `#avatar-${userAvatarId}`}></use>
      </svg>
      <h3 className="center">Aguarde os outros jogadores entrarem.</h3>
      <AdminOnly className="lobby-waiting__lock-button">
        <Typography.Text className="center padding">
          Jogadores necessários: {numPlayers}/{gameMeta.min}
        </Typography.Text>
        <Button
          type="primary"
          danger
          onClick={onLockGameAndStart}
          disabled={isLoading || numPlayers < gameMeta.min}
        >
          Trancar e Iniciar Jogo
        </Button>
      </AdminOnly>
    </div>
  );
}

export default Waiting;
