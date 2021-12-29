import { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Design Resources
import { Image, Modal, message, Button, notification } from 'antd';
// Adapters
import { ADMIN_API } from '../../adapters';
// Hooks
import { useGlobalState, useLanguage, useLoading, useLocalStorage } from '../../hooks';
// Constants
import { LATEST_GAME_IDS, PUBLIC_URL } from '../../utils/constants';
// Components
import { Loading } from '../loaders';
import { Instruction, Title, Translate, translate } from '../shared';

const updateLocal24hGameIds = (latestGameIds: PlainObject, newId: GameId) => {
  const now = Date.now();
  const past24Hours = now - 1000 * 60 * 60 * 24;
  const cleanedUpIds = Object.entries(latestGameIds ?? {}).reduce((acc: PlainObject, [key, timestamp]) => {
    if (timestamp > past24Hours) {
      acc[key] = timestamp;
    }
    return acc;
  }, {});
  return {
    [LATEST_GAME_IDS]: {
      ...cleanedUpIds,
      [newId]: now,
    },
  };
};

type CreateGameModalProps = {
  gameInfo: GameInfo;
};

export function CreateGameModal({ gameInfo }: CreateGameModalProps): JSX.Element {
  const history = useHistory();
  const language = useLanguage();
  const [, setLoader] = useLoading();
  const [getLocalStorage, setLocalStorage] = useLocalStorage();
  const [isVisible, setVisibility] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [, setUserId] = useGlobalState('userId');
  const [, setUserName] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');

  const onCloseModal = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    async function createGame() {
      try {
        setLoader('create', true);
        const response: PlainObject = await ADMIN_API.createGame({
          gameCode: gameInfo.gameCode,
          language,
        });
        if (response.data.gameId) {
          setGameId(response.data.gameId);
          setUserId(null);
          setUserName('');
          setUserAvatarId('');
          setLocalStorage(updateLocal24hGameIds(getLocalStorage(LATEST_GAME_IDS), response.data.gameId));
        }
      } catch (e: any) {
        notification.error({
          message: translate(
            'Aplicativo encontrou um erro ao tentar criar o jogo',
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
              alt={gameInfo.title[language]}
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
