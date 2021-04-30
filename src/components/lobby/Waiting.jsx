import React from 'react';
// Design Resources
import { Image } from 'antd';
// // Adapters
// import { GAME_API } from '../../adapters';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Images
import avatars from '../../images/avatars.svg';
// Utils
import { PUBLIC_URL } from '../../utils/constants';

function Join({ players, gameDescription }) {
  // const [gameId] = useGlobalState('gameId');
  // const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [myAvatar] = useGlobalState('myAvatar');

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
      {/* <Button
        className="lobby__join-button"
        type="primary"
        disabled={!Boolean(tempMe) || isLoading}
        onClick={onAddPlayer}
      >
        Trancar e Iniciar Jogo
      </Button> */}
    </div>
  );
}

export default Join;
