import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Image, Modal, message, Button, notification, Divider, Typography, Switch, Space, Alert } from 'antd';
// Adapters
import { ADMIN_API } from 'services/adapters';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useRedirectToNewGame } from 'hooks/useRedirectToNewGame';
// Constants
import { LATEST_GAME_IDS, PUBLIC_URL } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { Loading } from 'components/loaders';

const updateLocal24hGameIds = (latestGameIds: NumberDictionary, newId: GameId) => {
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

const latestGameBeforeNewOne = (latestGameIds: NumberDictionary) => {
  const idsObjectList = Object.entries(latestGameIds).map(([gameId, createdAt]) => ({ gameId, createdAt }));
  if (idsObjectList.length < 2) {
    return null;
  }

  const orderedList = orderBy(idsObjectList, 'createdAt', 'desc');
  const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours
  const currentMilliseconds = Date.now();

  // Check if game is too old
  if (orderedList[1].createdAt - currentMilliseconds > twoHoursInMilliseconds) {
    return null;
  }

  return orderedList[1].gameId;
};

type CreateGameModalProps = {
  gameInfo: GameInfo;
};

export function CreateGameModal({ gameInfo }: CreateGameModalProps): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, copyToClipboard] = useCopyToClipboard();

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
  const previousGameId = latestGameBeforeNewOne(getLocalStorage(LATEST_GAME_IDS));

  const { startRedirect, isSettingRedirect, wasRedirectSuccessful } = useRedirectToNewGame();

  useEffect(() => {
    if (state.value && gameId) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, gameId]);

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
        gameName: gameInfo.gameName,
        language,
        options,
      });
      if (response.data.gameId) {
        setGameId(response.data.gameId);
        setUserId(null);
        setUserName('');
        setUserAvatarId('');
        setLocalStorage(updateLocal24hGameIds(getLocalStorage(LATEST_GAME_IDS), response.data.gameId));
        const baseUrl = window.location.href.split(pathname)[0];
        copyToClipboard(`${baseUrl}/${response.data.gameId}`);
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

  const onConfirmGame = async () => {
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
      <Button type="primary" onClick={() => setVisibility(true)} block>
        <Translate pt="Criar" en="Create" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Criando novo jogo', 'Creating new game')}: ${gameInfo.title[language]}`}
          open={isVisible}
          onCancel={onCloseModal}
          onOk={onConfirmGame}
          okButtonProps={{ disabled: Boolean(!gameId) || isSettingRedirect }}
          maskClosable={false}
        >
          <>
            <Image
              alt={gameInfo.title[language]}
              src={`${PUBLIC_URL.BANNERS}${gameInfo.gameName}-${language}.jpg`}
              fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
              className="round-corners"
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

            {gameInfo.version.startsWith('alpha') && (
              <Alert
                type="warning"
                showIcon
                message={
                  <Translate
                    pt="Este jogo está em alpha, não o jogue"
                    en="This game is still in alpha and shouldn't be played"
                  />
                }
              />
            )}

            {gameInfo.version.startsWith('beta') && (
              <Alert
                type="warning"
                showIcon
                message={
                  <Translate
                    pt="Este jogo está em beta, prossiga com cuidado"
                    en="This game is in beta and bugs might be everywhere"
                  />
                }
              />
            )}

            {Boolean(gameId) ? (
              <div>
                <Title className="center">
                  <Translate pt="Jogo inicializado" en="Game Initialized" />: {gameId}
                </Title>
                <Instruction>
                  {previousGameId && !wasRedirectSuccessful && (
                    <Alert
                      type="info"
                      showIcon
                      message={
                        <>
                          <Translate
                            pt={
                              <>
                                Você quer redirecionar jogadores em {previousGameId} para essa nova partida?
                              </>
                            }
                            en={<>Redirect players in {previousGameId} to this new play?</>}
                          />
                          <Button
                            size="large"
                            onClick={() =>
                              startRedirect(previousGameId ?? '', gameId ?? '', gameInfo.gameName)
                            }
                            disabled={!gameId || !previousGameId}
                            loading={isSettingRedirect}
                          >
                            <Translate pt="Redirecione-os" en="Redirect them" />
                          </Button>
                        </>
                      }
                    />
                  )}
                  {wasRedirectSuccessful && (
                    <Alert
                      type="info"
                      showIcon
                      message={
                        <Translate
                          pt={
                            <>
                              Jogadores em {previousGameId} foram convidados para o jogo {gameId}
                            </>
                          }
                          en={
                            <>
                              Players in {previousGameId} have been invited to {gameId}
                            </>
                          }
                        />
                      }
                    />
                  )}
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
  options?: GameInfo['options'];
  disabled: boolean;
  onChangeOptions: GenericFunction;
  selectedOptions: PlainObject;
};
function Options({ options = [], disabled, onChangeOptions, selectedOptions }: OptionsProps) {
  return Boolean(options.length) ? (
    <div className="create-game-modal-options">
      <Typography.Title level={5} className="create-game-modal-options__title">
        <Translate pt="Opções:" en="Options:" />
      </Typography.Title>
      {(options ?? []).map((option) => (
        <Typography.Paragraph
          key={`option-${option.label}`}
          className={clsx(
            'create-game-modal-options__option',
            option.disabled && 'create-game-modal-options__option--disabled'
          )}
        >
          <span className="create-game-modal-options__label">{option.label}</span>
          <span
            className={clsx(
              'create-game-modal-options__off',
              !selectedOptions[option.key] && 'create-game-modal-options--selected'
            )}
          >
            {option?.off ?? ''}
          </span>
          <Switch disabled={disabled || option.disabled} onChange={(e) => onChangeOptions(option.key, e)} />
          <span
            className={clsx(
              'create-game-modal-options__on',
              selectedOptions[option.key] && 'create-game-modal-options--selected'
            )}
          >
            {option?.on ?? ''}
          </span>
          {Boolean(option.description) && (
            <span className="create-game-modal-options__option-description">{option.description}</span>
          )}
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
