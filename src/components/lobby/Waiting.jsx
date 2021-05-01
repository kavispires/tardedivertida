import React, { useCallback } from 'react';
// Design Resources
import { Button, Image, message, notification } from 'antd';
// // Adapters
import { GAME_API } from '../../adapters';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Images
import avatars from '../../images/avatars.svg';
// Utils
import { PUBLIC_URL } from '../../utils/constants';
import { useLoading } from '../../hooks';

function Waiting({ gameDescription }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [isAdmin] = useGlobalState('isAdmin');
  const [me] = useGlobalState('me');
  const [myAvatar] = useGlobalState('myAvatar');

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
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('lock-game', false);
    }
  }, [gameId, gameName, setLoader]);

  return (
    <div className="lobby-waiting">
      <Image
        alt={gameDescription?.title}
        src={`${PUBLIC_URL.BANNERS}game-image-${gameDescription?.image}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
      />

      <h1 className="center">{me || 'Fulano'},</h1>
      <svg viewBox="0 0 100 100" className="lobby-waiting__avatar">
        <use href={avatars + `#avatar-${myAvatar}`}></use>
      </svg>
      <h3 className="center">Aguarde os outros jogadores entrarem.</h3>
      {isAdmin && (
        <Button
          className="lobby-waiting__lock-button"
          type="primary"
          onClick={onLockGameAndStart}
          disabled={isLoading}
        >
          Trancar e Iniciar Jogo
        </Button>
      )}
    </div>
  );
}

export default Waiting;
