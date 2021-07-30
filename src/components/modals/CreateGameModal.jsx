import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
// Design Resources
import { Image, Modal, message, Button, notification } from 'antd';
// Adapters
import { GAME_API } from '../../adapters';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Constants
import { PUBLIC_URL } from '../../utils/constants';
// Components
import { Loading } from '../loaders';
import { Instruction, Title, Translate, translate } from '../shared';

export function CreateGameModal({ gameInfo }) {
  const history = useHistory();
  const language = useLanguage();
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
        const response = await GAME_API.initializeGame({ gameCode: gameInfo.gameCode, language });
        if (response.data.gameId) {
          setGameId(response.data.gameId);
        }
      } catch (e) {
        notification.error({
          message: translate(
            'Applicativo encontrou um erro ao tentar criar o jogo',
            'The application found an error while trying to create a game',
            language
          ),
          description: JSON.stringify(e.message),
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
      message.info(
        translate('Péra! O jogo ainda não foi inicializado.', 'Wait! The game has not been created', language)
      );
    }
  };

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisibility(true)}>
        <Translate pt="Criar Jogo" en="Create Game" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Criando jogo', 'Creating game', language)}: ${gameInfo.title[language]}`}
          visible={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
        >
          <Fragment>
            <Image
              alt={gameInfo.title}
              src={`${PUBLIC_URL.BANNERS}game-image-${gameInfo.gameName}-${language}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
            />

            {isLoading ? (
              <Fragment>
                <Instruction>
                  <Translate pt="O jogo está sendo criado..." en="The game session is being created" />
                </Instruction>
                <Loading message={translate('Gerando...', 'Generating...', language)} margin />
              </Fragment>
            ) : (
              <div>
                <Title className="center">
                  <Translate pt="Jogo inicializado" en="Game Initialized" />: {gameId}
                </Title>
                <Instruction>
                  <Translate
                    pt="Pressione OK para ser redirecionadx à página do jogo."
                    en="Press OK to be redirected to the game page"
                  />
                </Instruction>
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
    title: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
  }),
};
