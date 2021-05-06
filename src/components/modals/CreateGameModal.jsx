import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
// Design Resources
import { Typography, Image, Modal, message, Button, notification } from 'antd';
// Adapters
import { GAME_API } from '../../adapters';
// Hooks
import { useLoading } from '../../hooks';
// Constants
import { PUBLIC_URL } from '../../utils/constants';
// Components
import Loading from '../loaders/Loading';
import Instruction from '../shared/Instruction';
import Title from '../shared/Title';

function CreateGameModal({ gameInfo }) {
  const history = useHistory();
  const [, setLoader] = useLoading();
  const [isVisible, setVisibility] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [gameId, setGameId] = useState(null);

  const onCloseModal = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    async function createGame() {
      try {
        setLoader('create', true);
        const response = await GAME_API.initializeGame({ gameCode: gameInfo.gameCode });
        if (response.data.gameId) {
          setGameId(response.data.gameId);
        }
      } catch (e) {
        notification.error({
          message: 'Applicativo encontrou um erro ao tentar criar o jogo',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setVisibility(false);
      } finally {
        setLoading(false);
        setLoader('create', false);
      }
    }

    if (isVisible) {
      createGame();
    }
  }, [isVisible]); // eslint-disable-line

  const onConfirmGame = () => {
    if (gameId) {
      history.push(`/${gameId}`);
    } else {
      message.info('Péra! O jogo ainda não foi inicializado.');
    }
  };

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisibility(true)}>
        Criar Jogo
      </Button>
      {isVisible && (
        <Modal
          title={`Criando jogo: ${gameInfo.title}`}
          visible={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
        >
          <Fragment>
            <Image
              alt={gameInfo.title}
              src={`${PUBLIC_URL.BANNERS}game-image-${gameInfo.gameName}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
            />

            {isLoading ? (
              <Fragment>
                <Instruction>O jogo está sendo criado...</Instruction>
                <Loading message="Gerando..." margin />
              </Fragment>
            ) : (
              <div>
                <Title className="center">Jogo inicializado: {gameId}</Title>
                <Instruction>Pressione OK para ser redirecionadx à página do jogo.</Instruction>
              </div>
            )}
          </Fragment>
        </Modal>
      )}
    </Fragment>
  );
}

CreateGameModal.propTypes = {
  gameInfo: PropTypes.shape({
    gameCode: PropTypes.string.isRequired,
    gameName: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default CreateGameModal;
