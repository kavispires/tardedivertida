import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { Modal, Button, Divider, Alert, App, Space } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
import { useGlobalState } from '@hooks/useGlobalState';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useRedirectToNewGame } from '@hooks/useRedirectToNewGame';
// Services
import { HOST_API, HOST_API_ACTIONS } from '@services/adapters';
// Components
import { GameStrip } from '@components/general/GameBanner';
import { Popconfirm } from '@components/general/Popconfirm';
import { LanguageSwitch } from '@components/language/LanguageSwitch';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Loading } from '@components/loaders/Loading';
import { Instruction } from '@components/text/Instruction';
import { Title } from '@components/text/Title';
// Internal
import { GameCustomizations } from './GameCustomizations';

const updateLocal24hGameIds = (latestGameIds: Dictionary<number>, newId: string) => {
  const now = Date.now();
  const past24Hours = now - 1000 * 60 * 60 * 24;
  const cleanedUpIds = Object.entries(latestGameIds ?? {}).reduce((acc: PlainObject, [key, timestamp]) => {
    if (timestamp > past24Hours) {
      acc[key] = timestamp;
    }
    return acc;
  }, {});
  return {
    ...cleanedUpIds,
    [newId]: now,
  };
};

const latestGameBeforeNewOne = (latestGameIds: Dictionary<number>) => {
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

const getOptionsDefaultValues = (
  options: GameInfo['options'],
): Record<string, boolean | string | string[]> => {
  return (
    options?.reduce((acc: Record<string, boolean | string | string[]>, option) => {
      if (option.kind === 'switch') {
        acc[option.key] = false;
      }
      if (option.kind === 'radio') {
        acc[option.key] = option.values[0].value;
      }
      if (option.kind === 'checkbox') {
        acc[option.key] = [];
      }
      return acc;
    }, {}) ?? {}
  );
};

type CreateGameFlowProps = {
  gameInfo: GameInfo;
};

export function CreateGameFlow({ gameInfo }: CreateGameFlowProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        block
        disabled={!gameInfo.available}
      >
        <Translate
          pt="Criar"
          en="Create"
        />
      </Button>
      {open && (
        <CreateGameModal
          gameInfo={gameInfo}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  );
}

type CreateGameModalProps = {
  gameInfo: GameInfo;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function CreateGameModal({ gameInfo, open, setOpen }: CreateGameModalProps) {
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, copyToClipboard] = useCopyToClipboard();

  const { language, translate } = useLanguage();
  const { setLoader } = useLoading();

  const [isLoading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [, setUserId] = useGlobalState('userId');
  const [, setUserName] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [options, setOptions] = useState(getOptionsDefaultValues(gameInfo.options));
  const [latestGameIds, setLatestGameIds] = useGlobalLocalStorage('latestGameIds');
  const previousGameId = latestGameBeforeNewOne(latestGameIds);

  const { startRedirect, isSettingRedirect, wasRedirectSuccessful } = useRedirectToNewGame();

  useEffect(() => {
    if (state.value && gameId) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, gameId, message]);

  const onChangeOptions = (key: string, value: boolean | string | string[]) => {
    setOptions((s) => ({
      ...s,
      [key]: value,
    }));
  };

  const createGame = async () => {
    try {
      setLoader('create', true);
      setLoading(true);

      const response: PlainObject = await HOST_API.run({
        action: HOST_API_ACTIONS.CREATE_GAME,
        gameName: gameInfo.gameName,
        language,
        options,
        version: gameInfo.version,
      });
      if (response.data.gameId) {
        setGameId(response.data.gameId);
        setUserId(null);
        setUserName('');
        setUserAvatarId('');
        setLatestGameIds(updateLocal24hGameIds(latestGameIds, response.data.gameId));
        const baseUrl = window.location.href.split(pathname)[0];
        copyToClipboard(`${baseUrl}/${response.data.gameId}`);
      }
    } catch (e: unknown) {
      notification.error({
        title: translate({
          pt: 'Aplicativo encontrou um erro ao tentar criar o jogo',
          en: 'The application found an error while trying to create a game',
          custom: language,
        }),
        description: JSON.stringify((e as Error).message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
      setOpen(false);
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
        translate({
          pt: 'Péra! O jogo ainda não foi inicializado.',
          en: 'Wait! The game has not been created',
        }),
      );
    }
  };

  return (
    <Modal
      title={`${translate({ pt: 'Criando novo jogo', en: 'Creating new game' })}: ${gameInfo.title[language]}`}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      mask={{ closable: false }}
    >
      <GameStrip
        title={gameInfo.title}
        gameName={gameInfo.gameName}
        className="round-corners"
        width={256}
        static
      />

      {!gameId && (
        <Instruction>
          <Translate
            pt="Você está criando um jogo em:"
            en="You are creating a game in:"
          />{' '}
          <LanguageSwitch />
        </Instruction>
      )}

      <GameCustomizations
        options={gameInfo.options}
        disabled={isLoading || Boolean(gameId)}
        onChangeOptions={onChangeOptions}
        selectedOptions={options}
      />

      <Divider />

      {isLoading && (
        <>
          <Instruction>
            <Translate
              pt="O jogo está sendo criado..."
              en="The game session is being created"
            />
          </Instruction>
          <Loading
            message={translate({ pt: 'Gerando...', en: 'Generating...' })}
            margin
          />
        </>
      )}

      {gameInfo.version.startsWith('alpha') && (
        <Alert
          type="warning"
          showIcon
          title={
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
          title={
            <Translate
              pt="Este jogo está em beta, prossiga com cuidado"
              en="This game is in beta and bugs might be everywhere"
            />
          }
        />
      )}

      {gameId ? (
        <div>
          <Title className="center">
            <Translate
              pt="Jogo inicializado"
              en="Game Initialized"
            />
            : {gameId}
          </Title>

          <Alert
            type="info"
            showIcon
            banner
            title={
              <>
                {previousGameId && !wasRedirectSuccessful && (
                  <Translate
                    pt={<>Você quer redirecionar jogadores em {previousGameId} para essa nova partida?</>}
                    en={<>Redirect players in {previousGameId} to this new play?</>}
                  />
                )}
                {wasRedirectSuccessful && (
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
                )}
              </>
            }
            action={
              <Space
                vertical
                className="ml-4"
              >
                {previousGameId && !wasRedirectSuccessful ? (
                  <Popconfirm
                    title={
                      <Translate
                        pt="Tem certeza que deseja ir para o jogo sem redirecionar os jogadores?"
                        en="Are you sure you want to go to the game without redirecting the players?"
                      />
                    }
                    onConfirm={onConfirmGame}
                  >
                    <Button block>
                      <Translate
                        pt="Ir para o jogo"
                        en="Go to game"
                      />
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    block
                    onClick={onConfirmGame}
                  >
                    <Translate
                      pt="Ir para o jogo"
                      en="Go to game"
                    />
                  </Button>
                )}

                <Button
                  block
                  type="primary"
                  onClick={() => {
                    startRedirect(previousGameId ?? '', gameId ?? '', gameInfo.gameName);
                  }}
                  disabled={!gameId || !previousGameId || wasRedirectSuccessful}
                  loading={isSettingRedirect}
                >
                  <Translate
                    pt="Redirecione-os"
                    en="Redirect them"
                  />
                </Button>
              </Space>
            }
          />
        </div>
      ) : (
        <SpaceContainer align="center">
          <Button
            type="primary"
            size="large"
            disabled={isLoading}
            onClick={createGame}
          >
            <Translate
              pt="Criar Jogo"
              en="Create Game"
            />
          </Button>
        </SpaceContainer>
      )}
    </Modal>
  );
}
