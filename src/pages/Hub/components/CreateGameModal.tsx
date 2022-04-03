import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Image, Modal, message, Button, notification, Divider, Typography, Switch, Space } from 'antd';
// Adapters
import { ADMIN_API } from 'services/adapters';
// Hooks
import { useGlobalState, useLanguage, useLoading, useLocalStorage } from 'hooks';
// Constants
import { LATEST_GAME_IDS, PUBLIC_URL } from 'utils/constants';
// Components
import { Instruction, Loading, Title, Translate } from 'components';

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
  const navigate = useNavigate();
  const { language, translate } = useLanguage();
  const { setLoader } = useLoading();
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
      navigate(`/${gameId}`);
    } else {
      message.info(
        translate('Péra! O jogo ainda não foi inicializado.', 'Wait! The game has not been created')
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
          title={`${translate('Criando novo jogo', 'Creating new game')}: ${gameInfo.title[language]}`}
          visible={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
          okButtonProps={{ disabled: Boolean(!gameId) }}
          maskClosable={false}
        >
          <>
            <Image
              alt={gameInfo.title[language]}
              src={`${PUBLIC_URL.BANNERS}game-image-${gameInfo.gameName}-${language}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
            />

            <Options
              options={gameInfo.options}
              disabled={isLoading || Boolean(gameId)}
              onChangeOptions={onChangeOptions}
              selectedOptions={options}
            />

            <Divider />

            {isLoading && (
              <>
                <Instruction>
                  <Translate pt="O jogo está sendo criado..." en="The game session is being created" />
                </Instruction>
                <Loading message={translate('Gerando...', 'Generating...')} margin />
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
              <Space className="space-container" align="center">
                <Button type="primary" size="large" disabled={isLoading} onClick={createGame}>
                  <Translate pt="Criar Jogo" en="Create Game" />
                </Button>
              </Space>
            )}
          </>
        </Modal>
      )}
    </>
  );
}

type OptionsProps = {
  options?: {
    label: string;
    key: string;
    on?: string;
    off?: string;
  }[];
  disabled: boolean;
  onChangeOptions: GenericFunction;
  selectedOptions: PlainObject;
};
function Options({ options, disabled, onChangeOptions, selectedOptions }: OptionsProps) {
  return Boolean(options) ? (
    <div className="create-game-modal-options">
      <Typography.Title level={5} className="create-game-modal-options__title">
        <Translate pt="Opções:" en="Options:" />
      </Typography.Title>

      {options!.map((option, index) => (
        <Typography.Paragraph key={`option-${option.label}`} className="create-game-modal-options__option">
          <span className="create-game-modal-options__label">{option.label}</span>
          <span
            className={clsx(
              'create-game-modal-options__off',
              !selectedOptions[option.key] && 'create-game-modal-options__selected'
            )}
          >
            {option?.off ?? ''}
          </span>
          <Switch disabled={disabled} onChange={(e) => onChangeOptions(option.key, e)} />
          <span
            className={clsx(
              'create-game-modal-options__on',
              selectedOptions[option.key] && 'create-game-modal-options__selected'
            )}
          >
            {option?.on ?? ''}
          </span>
        </Typography.Paragraph>
      ))}
    </div>
  ) : (
    <div className="create-game-modal-options create-game-modal-options__no-options">
      <Typography.Text>
        <Translate pt="Este jogo não possui customizações" en="This game does not support customizations" />
      </Typography.Text>
    </div>
  );
}
