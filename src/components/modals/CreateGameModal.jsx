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

function CreateGameModal({ game }) {
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
        const response = await GAME_API.initializeGame({ gameCode: game.id });
        if (response.data.id) {
          setGameId(response.data.id);
        }
      } catch (e) {
        console.error(e);
        notification.error({
          message: 'Applicativo encontrou um erro ao tentar criar o jogo',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
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
          title={`Criando jogo: ${game.title}`}
          visible={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
        >
          <Fragment>
            <Image
              alt={game.title}
              src={`${PUBLIC_URL.BANNERS}game-image-${game.image}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
            />

            {isLoading ? (
              <Fragment>
                <Typography.Paragraph className="center">O jogo está sendo criado...</Typography.Paragraph>
                <Loading message="Gerando..." margin />
              </Fragment>
            ) : (
              <div>
                <Typography.Title className="center">Jogo inicializado: {gameId}</Typography.Title>
                <Typography.Paragraph>
                  Pressione OK para ser redirecionadx à página do jogo.
                </Typography.Paragraph>
              </div>
            )}
          </Fragment>
        </Modal>
      )}
    </Fragment>
  );
}

CreateGameModal.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default CreateGameModal;
