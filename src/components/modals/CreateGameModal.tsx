import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Design Resources
import { Image, Modal, message, Button, notification, Divider, Typography, Switch } from 'antd';
// Adapters
import { ADMIN_API } from '../../adapters';
// Hooks
import { useGlobalState, useLanguage, useLoading, useLocalStorage } from '../../hooks';
// Constants
import { LATEST_GAME_IDS, PUBLIC_URL } from '../../utils/constants';
// Components
import { Loading } from '../loaders';
import { ButtonContainer, Instruction, Title, Translate, translate } from '../shared';

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
  const [isLoading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [, setUserId] = useGlobalState('userId');
  const [, setUserName] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [options, setOptions] = useState({});

  const onCloseModal = useCallback(() => {
    setVisibility(false);
  }, []);

  const onChangeOptions = (key: string, value: boolean) => {
    setOptions((s) => ({
      ...s,
      [key]: value,
    }));
  };

  const createGame = async () => {
    try {
      setLoader('create', true);
      setLoading(true);
      const response: PlainObject = await ADMIN_API.createGame({
        gameCode: gameInfo.gameCode,
        language,
        options,
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
  };

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
    <>
      <Button type="primary" onClick={() => setVisibility(true)}>
        <Translate pt="Criar Jogo" en="Create Game" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Criando novo jogo', 'Creating new game', language)}: ${
            gameInfo.title[language]
          }`}
          visible={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
          okButtonProps={{ disabled: Boolean(!gameId) }}
        >
          <>
            {console.log({ gameInfo })}
            <Image
              alt={gameInfo.title[language]}
              src={`${PUBLIC_URL.BANNERS}game-image-${gameInfo.gameName}-${language}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
            />

            {Boolean(gameInfo.options) ? (
              <div className="create-game-modal-options">
                <Typography.Title level={4}>
                  <Translate pt="Opções:" en="Options:" />
                </Typography.Title>

                {gameInfo.options!.map((option, index) => (
                  <Typography.Paragraph key={`option-${option.label}`}>
                    <Switch
                      disabled={isLoading || Boolean(gameId)}
                      onChange={(e) => onChangeOptions(option.key, e)}
                    />{' '}
                    {option.label}
                  </Typography.Paragraph>
                ))}
              </div>
            ) : (
              <Typography.Text>
                <Translate pt="Este jogo não possui customizações" en="This game has no customizations" />
              </Typography.Text>
            )}

            <Divider />

            {isLoading && (
              <>
                <Instruction>
                  <Translate pt="O jogo está sendo criado..." en="The game session is being created" />
                </Instruction>
                <Loading message={translate('Gerando...', 'Generating...', language)} margin />
              </>
            )}

            {Boolean(gameId) ? (
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
            ) : (
              <ButtonContainer>
                <Button type="primary" size="large" disabled={isLoading} onClick={createGame}>
                  <Translate pt="Criar Jogo" en="Create Game" />
                </Button>
              </ButtonContainer>
            )}
          </>
        </Modal>
      )}
    </>
  );
}
