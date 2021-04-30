import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Alert, Avatar, Button, Image, Input, Layout } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
// Adapters
import { GAME_API } from '../adapters';
// State
import useGameState from '../states/useGameState';
// Images
import avatars from '../images/avatars.svg';
// Utils
import { AVATAR_IDS } from '../utils/constants';
import { getRandomItem } from '../utils/index';
import AvatarEntry from './AvatarEntry';

function Lobby({ players = {} }) {
  const [gameId, setGameId] = useGameState('gameId');
  const [me, setMe] = useGameState('me');
  const [myAvatar, setMyAvatar] = useGameState('gameId');

  const [availableAvatars, setAvailableAvatars] = useState(AVATAR_IDS);

  const [tempAvatar, setTempAvatar] = useState(getRandomItem(AVATAR_IDS));
  const [tempMe, setTempMe] = useState('');

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

  return (
    <Layout.Content className="lobby">
      <div className="lobby__room">
        {players.map((player, index) => (
          <AvatarEntry
            key={player.name}
            id={player.avatarId}
            name={player.name}
            className={`lobby__seat lobby__seat--${index}`}
            animate
          />
        ))}

        <div className="lobby__join-container">
          <h1 className="lobby__join-title">Select your Avatar</h1>
          <div className="lobby__avatar-selection">
            <Button type="dashed" onClick={onPreviousAvatar} className="lobby__avatar-nav-button">
              <CaretLeftOutlined />
            </Button>
            <svg viewBox="0 0 100 100" className="lobby__avatar-selection-image">
              <use href={avatars + `#avatar-${tempAvatar}`}></use>
            </svg>
            <Button type="dashed" onClick={onNextAvatar} className="lobby__avatar-nav-button">
              <CaretRightOutlined />
            </Button>
          </div>
          <Alert
            className="lobby__avatar-alert"
            type="warning"
            message="Se alguém escolher o mesmo avatar que você, um avatar aleatório será escolhido pra você."
          />
          <Input
            className="lobby__name-input"
            onChange={(e) => setTempMe(e.target.value)}
            placeholder="Insira seu nome"
          />
          <Button className="lobby__join-button" type="primary" disabled={!Boolean(me)}>
            Entrar no jogo
          </Button>
        </div>
      </div>
    </Layout.Content>
  );
}

export default Lobby;
