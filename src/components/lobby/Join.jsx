import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Alert, Button, Image, Input, notification, Spin, Tooltip } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
// API & Hooks
import { GAME_API } from '../../adapters';
import { useLoading } from '../../hooks';
import useGlobalState from '../../hooks/useGlobalState';
// Images
import avatars from '../../images/avatars.svg';
// Services
import localStorage from '../../services/localStorage';
// Utils
import { AVATAR_IDS, PUBLIC_URL } from '../../utils/constants';
import { getRandomItem } from '../../utils/index';

function Join({ players, info }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [, setMe] = useGlobalState('me');
  const [, setMyAvatar] = useGlobalState('myAvatar');

  const [availableAvatars, setAvailableAvatars] = useState(AVATAR_IDS);
  const [tempAvatar, setTempAvatar] = useState(getRandomItem(AVATAR_IDS));
  const [tempMe, setTempMe] = useState('');
  const [sameGameId, setSameGameId] = useState(false);

  const [localStorageAvatar, setLocalStorageAvatar] = useState(null);

  // Calculate available avatars and monitor if user chose a non-available one
  useEffect(() => {
    const usedAvatars = Object.values(players).reduce((acc, p) => {
      acc[p.avatarId] = true;
      return acc;
    }, {});

    const newAvailableAvatars = AVATAR_IDS.filter((avatarId) => usedAvatars[avatarId] === undefined);

    if (newAvailableAvatars.includes(tempAvatar) && !localStorageAvatar) {
      setTempAvatar(getRandomItem(newAvailableAvatars));
    }

    setAvailableAvatars(newAvailableAvatars);
  }, [players]); // eslint-disable-line

  // Load name and avatarId from localStorage
  useEffect(() => {
    const lsAvatarId = localStorage.get('avatarId');
    const lsMe = localStorage.get('me');
    const lsGameId = localStorage.get('gameId');

    if (lsAvatarId && lsMe) {
      setTempAvatar(localStorage.get('avatarId'));
      setTempMe(localStorage.get('me') ?? '');
      setLocalStorageAvatar(lsAvatarId);

      if (lsGameId === gameId) {
        setSameGameId(true);
      }
    }
  }, []); // eslint-disable-line

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

  const onAddPlayer = useCallback(async () => {
    try {
      setLoader('add-player', true);
      const response = await GAME_API.addPlayer({
        gameId,
        gameName,
        playerName: tempMe,
        playerAvatarId: tempAvatar,
      });

      setMe(response.data.name);
      setMyAvatar(response.data.avatarId);
      localStorage.set({
        me: response.data.name,
        avatarId: response.data.avatarId,
        gameId,
      });
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar te adicionar como jogador',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('add-player', false);
    }
  }, [gameId, gameName, tempMe, tempAvatar]); // eslint-disable-line

  return (
    <div className="lobby-join">
      <Image
        alt={info?.title}
        src={`${PUBLIC_URL.BANNERS}game-image-${info?.gameName}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
        className="lobby-join__game-image"
      />
      <h1 className="lobby-join__title">
        {Boolean(localStorageAvatar) ? 'Bem-vindo de volta!' : 'Selecione seu avatar'}
      </h1>
      <div className="lobby-join__avatar-selection">
        <Button type="dashed" onClick={onPreviousAvatar} className="lobby-join__avatar-nav-button">
          <CaretLeftOutlined />
        </Button>
        <svg viewBox="0 0 100 100" className="lobby-join__avatar-selection-image">
          <use href={avatars + `#avatar-${tempAvatar}`}></use>
        </svg>
        <Button type="dashed" onClick={onNextAvatar} className="lobby-join__avatar-nav-button">
          <CaretRightOutlined />
        </Button>
      </div>

      {Boolean(localStorageAvatar) ? (
        <Alert
          className="lobby-join__avatar-alert"
          type="success"
          message="Você está de volta! Lembramos seu nome e avatar!"
        />
      ) : (
        <Alert
          className="lobby-join__avatar-alert"
          type="warning"
          message="Se alguém selecionar um mesmo avatar, um avatar aleatório será atribuido à você."
        />
      )}

      {Boolean(sameGameId) && (
        <Alert
          className="lobby-join__avatar-alert"
          type="error"
          message="Se você está retornando a um jogo, NÃO mude seu apelido! Se o apelido for modificado, você será adicionado como um novo jogador e tudo pode bugar."
        />
      )}

      <Input
        className="lobby-join__name-input"
        onChange={(e) => setTempMe(e.target.value)}
        placeholder="Insira seu nome"
        value={tempMe}
        maxLength={10}
        suffix={
          <Tooltip title="Máximo de 10 characteres">
            <InfoCircleOutlined />
          </Tooltip>
        }
      />
      <Button
        className="lobby-join__join-button"
        type="primary"
        disabled={!Boolean(tempMe) || isLoading}
        onClick={onAddPlayer}
      >
        {isLoading ? <Spin size="small" /> : 'Entrar no jogo'}
      </Button>
    </div>
  );
}

export default Join;
