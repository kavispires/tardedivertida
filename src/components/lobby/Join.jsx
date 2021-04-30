import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Alert, Button, Image, Input, notification, Spin, Tooltip } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
// Adapters
import { GAME_API } from '../../adapters';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Images
import avatars from '../../images/avatars.svg';
// Services
import localStorage from '../../services/localStorage';
// Utils
import { AVATAR_IDS, PUBLIC_URL } from '../../utils/constants';
import { getRandomItem } from '../../utils/index';
// Components
import { useLoading } from '../../hooks';

function Join({ players, gameDescription }) {
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [, setMe] = useGlobalState('me');
  const [, setMyAvatar] = useGlobalState('myAvatar');

  const [availableAvatars, setAvailableAvatars] = useState(AVATAR_IDS);
  const [tempAvatar, setTempAvatar] = useState(getRandomItem(AVATAR_IDS));
  const [tempMe, setTempMe] = useState('');

  const [isLoading, setLoader] = useLoading();

  // Load name and avatarId from localStorage
  useEffect(() => {
    setTempAvatar(localStorage.get('avatarId') ?? tempAvatar);
    setTempMe(localStorage.get('me') ?? '');
  }, []); // eslint-disable-line

  // Calculate available avatars and monitor if user chose a non-available one
  useEffect(() => {
    const usedAvatars = Object.values(players).reduce((acc, p) => {
      acc[p.avatarId] = true;
      return acc;
    }, {});

    const newAvailableAvatars = AVATAR_IDS.filter((avatarId) => usedAvatars[avatarId] === undefined);

    if (newAvailableAvatars.includes(tempAvatar)) {
      setTempAvatar(getRandomItem(newAvailableAvatars));
    }

    setAvailableAvatars(newAvailableAvatars);
  }, [players]); // eslint-disable-line

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
      const payload = {
        gameId,
        game: gameName,
        playerName: tempMe,
        playerAvatarId: tempAvatar,
      };
      const response = await GAME_API.addPlayer(payload);

      setMe(response.data.name);
      setMyAvatar(response.data.avatarId);
      localStorage.set({
        me: response.data.name,
        avatarId: response.data.avatarId,
      });
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar adicionar você como jogador',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
    } finally {
      setLoader('add-player', false);
    }
  }, [gameId, gameName, tempMe, tempAvatar]); // eslint-disable-line

  return (
    <div className="lobby-join">
      <Image
        alt={gameDescription?.title}
        src={`${PUBLIC_URL.BANNERS}game-image-${gameDescription?.image}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
      />
      <h1 className="lobby-join__title">Selecione seu avatar</h1>
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
      <Alert
        className="lobby-join__avatar-alert"
        type="warning"
        message="Se alguém escolher o mesmo avatar que você, um avatar aleatório será escolhido pra você."
      />
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
        className="lobby__join-button"
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
