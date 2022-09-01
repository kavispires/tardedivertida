import { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Alert, Button, Image, Input, notification, Tooltip } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
// API & Hooks
import { GAME_API } from 'services/adapters';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useGlobalState } from 'hooks/useGlobalState';
// Images
import avatars from 'assets/images/avatars.svg';
// Services
import localStorage from 'services/localStorage';
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/avatars';
import { PUBLIC_URL } from 'utils/constants';
import { getRandomItem, isDevEnv } from 'utils/helpers';
import { getRandomWelcomeMessage, speak } from 'utils/speech';
import { mockPlayerName } from 'mock/players';
// Components
import { Translate } from 'components/language';

const randomName = isDevEnv ? mockPlayerName() : undefined;

type JoinProps = {
  info: GameInfo;
  players: GamePlayers;
  meta: GameMeta;
};

export function Join({ players, info, meta }: JoinProps) {
  const { language, translate } = useLanguage();
  const { isLoading, setLoader } = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [volume, setVolume] = useGlobalState('volume');

  const [availableAvatars, setAvailableAvatars] = useState(AVAILABLE_AVATAR_IDS);
  const [tempAvatar, setTempAvatar] = useState(getRandomItem(AVAILABLE_AVATAR_IDS));
  const [tempUsername, setTempUsername] = useState('');
  const [sameGameId, setSameGameId] = useState(false);

  const [localStorageAvatar, setLocalStorageAvatar] = useState(null);
  console.log({ volume });

  // Calculate available avatars and monitor if user chose a non-available one
  useEffect(() => {
    const usedAvatars = Object.values(players).reduce((acc: PlainObject, { avatarId, name }) => {
      if (name !== tempUsername) {
        acc[avatarId] = true;
      }
      return acc;
    }, {});

    const newAvailableAvatars = AVAILABLE_AVATAR_IDS.filter(
      (avatarId) => usedAvatars[avatarId] === undefined
    );

    if (newAvailableAvatars.includes(tempAvatar) && !localStorageAvatar) {
      setTempAvatar(getRandomItem(newAvailableAvatars));
    }

    setAvailableAvatars(newAvailableAvatars);
  }, [players]); // eslint-disable-line

  // Load name and avatarId from localStorage
  useEffectOnce(() => {
    const lsAvatarId = localStorage.get('avatarId');
    const lsUsername = localStorage.get('username');
    const lsGameId = localStorage.get('gameId');

    if (lsAvatarId && lsUsername) {
      setTempAvatar(localStorage.get('avatarId'));
      setTempUsername(localStorage.get('username') ?? '');
      setLocalStorageAvatar(lsAvatarId);

      if (lsGameId === gameId) {
        setSameGameId(true);
      }
    }
  });

  const onPreviousAvatar = useCallback(() => {
    const index = availableAvatars.indexOf(tempAvatar);
    const newIndex = index === 0 ? availableAvatars.length - 1 : index - 1;
    setTempAvatar(availableAvatars[newIndex]);
  }, [availableAvatars, tempAvatar]);

  const onNextAvatar = useCallback(() => {
    const index = availableAvatars.indexOf(tempAvatar);
    const newIndex = index === availableAvatars.length - 1 ? 0 : index + 1;
    setTempAvatar(availableAvatars[newIndex]);
  }, [availableAvatars, tempAvatar]);

  const onAddPlayer = useCallback(
    async (_?: any, vol?: number) => {
      try {
        setLoader('add-player', true);
        const response: PlainObject = await GAME_API.addPlayer({
          gameId,
          gameName,
          playerName: tempUsername,
          playerAvatarId: tempAvatar,
        });

        setUserId(response.data.id);
        setUsername(response.data.name);
        setUserAvatarId(response.data.avatarId);

        localStorage.set({
          username: response.data.name,
          avatarId: response.data.avatarId,
          gameId,
        });

        speak(
          getRandomWelcomeMessage(response.data.name ?? translate('vei', 'babe')),
          language,
          vol ?? volume
        );
      } catch (e: any) {
        notification.error({
          message: translate(
            'Vixi, o aplicativo encontrou um erro ao tentar te adicionar como jogador',
            'Oops, the application failed when trying to add you as a player'
          ),
          description: JSON.stringify(e.message),
          placement: 'bottomLeft',
        });
        console.error(e);
      } finally {
        setLoader('add-player', false);
      }
    },
    [gameId, gameName, tempUsername, tempAvatar] // eslint-disable-line
  );

  const onEnter = () => {
    setVolume(0.5);
    onAddPlayer(null, 0.5);
  };

  const onEnterWithoutSound = () => {
    setVolume(0);
    onAddPlayer(null, 0);
  };

  const onEnterInput = (e: any) => {
    if (e.key === 'Enter') {
      setVolume(0.5);
      onAddPlayer(null, 0.5);
    }
  };

  return (
    <div className="lobby-join">
      <div className="lobby-join__card">
        <Image
          alt={info?.title[language]}
          src={`${PUBLIC_URL.BANNERS}${info?.gameName}-${language}.jpg`}
          fallback={`${PUBLIC_URL.BANNERS}/em-breve.jpg`}
          className="lobby-join__game-image"
        />
        <h1 className="lobby-join__title">
          {Boolean(localStorageAvatar) ? (
            <Translate pt="Bem-vindo de volta!" en="Welcome Back!" />
          ) : (
            <Translate pt="Selecione seu avatar" en="Select your avatar" />
          )}
        </h1>
        <div className="lobby-join__avatar-selection">
          <Button type="dashed" onClick={onPreviousAvatar} className="lobby-join__avatar-nav-button">
            <CaretLeftOutlined />
          </Button>
          <svg viewBox="0 0 100 100" className="lobby-join__avatar-selection-image">
            <use href={avatars + `#avatar-${tempAvatar}`}></use>
            <title>{AVATARS[tempAvatar].description[language]}</title>
          </svg>
          <Button type="dashed" onClick={onNextAvatar} className="lobby-join__avatar-nav-button">
            <CaretRightOutlined />
          </Button>
        </div>
        <div className="lobby-join__description">
          <small>{AVATARS[tempAvatar].description[language]}</small>
        </div>

        {Boolean(localStorageAvatar) ? (
          <Alert
            className="lobby-join__avatar-alert"
            type="success"
            message={translate(
              'Você está de volta! Lembramos seu nome e avatar!',
              "You're back! We saved your name and avatar!"
            )}
          />
        ) : (
          <Alert
            className="lobby-join__avatar-alert"
            type="warning"
            message={translate(
              'Se alguém selecionar um mesmo avatar, um avatar aleatório será atribuído à você.',
              'If you selected the same avatar of someone else, a new random avatar will be given to you.'
            )}
          />
        )}

        {Boolean(sameGameId) && meta.isComplete && (
          <Alert
            className="lobby-join__avatar-alert"
            type="error"
            message={translate(
              'Se você está retornando a um jogo, NÃO mude seu apelido! Se o apelido for modificado, você será adicionado como um novo jogador e tudo pode bugar.',
              'If you are returning to a game, DO NOT change your nickname else the game might crash.'
            )}
          />
        )}

        <Input
          className="lobby-join__name-input"
          onChange={(e) => setTempUsername(e.target.value.trim())}
          placeholder={translate('Digite seu nome', 'Insert your name')}
          value={tempUsername || randomName}
          maxLength={10}
          suffix={
            <Tooltip title={translate('Máximo de 10 caracteres', '10 characters max')}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          onKeyPress={onEnterInput}
        />
        <Button
          className="lobby-join__join-button"
          type="primary"
          disabled={!Boolean(tempUsername) || isLoading}
          onClick={onEnter}
          loading={isLoading}
        >
          <Translate pt="Entrar" en="Enter" />
        </Button>
        <Button
          className="lobby-join__join-button-link"
          type="primary"
          ghost
          disabled={!Boolean(tempUsername) || isLoading}
          onClick={onEnterWithoutSound}
          loading={isLoading}
          size="small"
        >
          <Translate pt="Entrar sem som" en="Enter without sound" />
        </Button>
      </div>
    </div>
  );
}
