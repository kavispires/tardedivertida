import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, Image, Modal, Spin, message } from 'antd';

import { GAME_API } from '../../adapters';
import { PUBLIC_URL } from '../../utils/constants';

function CreateGameModal({ gameInfo, isVisible, onCloseModal }) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    try {
      async function createGame() {
        const response = await GAME_API.initializeGame({ gameCode: gameInfo.id });
        if (response.data.id) {
          setGameId(response.data.id);
          setLoading(false);
        }
      }

      createGame();
    } catch (e) {
      console.error(e);
    }
  }, []); // eslint-disable-line

  const onConfirmGame = () => {
    if (gameId) {
      history.push(`/${gameId}`);
    } else {
      message.info('Péra! O jogo ainda não foi inicializado.');
    }
  };

  return (
    <Modal
      title={`Criando jogo: ${gameInfo.title}`}
      visible={isVisible}
      onCancel={onCloseModal}
      onOk={onConfirmGame}
    >
      <Image
        alt={gameInfo.title}
        src={`${PUBLIC_URL.BANNERS}game-image-${gameInfo.image}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
      />
      {isLoading ? (
        <Fragment>
          <Typography.Paragraph>O jogo está sendo criado...</Typography.Paragraph>
          <Spin />
        </Fragment>
      ) : (
        <div>
          <Typography.Title>Jogo inicializado: {gameId}</Typography.Title>
          <Typography.Paragraph>Pressione OK para ser redirecionado a página do jogo.</Typography.Paragraph>
        </div>
      )}
    </Modal>
  );
}

export default CreateGameModal;
