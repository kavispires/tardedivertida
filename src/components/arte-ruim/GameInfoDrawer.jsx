import React, { Fragment, useState } from 'react';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Components
import Avatar from '../avatars/Avatar';
import { Affix, Badge, Button, Divider, Drawer } from 'antd';
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';

function GameInfoDrawer({ players, state, info, me }) {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const completeMe = players[me];
  const rankedPlayers = Object.values(players).sort((a, b) => (a.score < b.score ? 1 : -1));
  console.table(players);
  return (
    <Fragment>
      <Affix offsetTop={10} className="game-info-drawer__affix-button">
        <Button
          type="primary"
          shape="circle"
          size="large"
          className="game-info-drawer__button"
          onClick={showDrawer}
          icon={<InfoCircleOutlined />}
        />
      </Affix>
      <Drawer title={info.title} placement="right" closable={false} onClose={onClose} visible={visible}>
        <div className="game-info-drawer__label">Você é</div>
        <div className="game-info-drawer__me">
          <Badge count={completeMe.score} className="game-info-drawer__avatar-with-badge">
            <Avatar id={completeMe.avatarId} shape="square" />
          </Badge>
          {completeMe.name}, {AVATAR_DESCRIPTIONS_BR[completeMe.avatarId]}
        </div>
        <Divider />
        <div>
          <div className="game-info-drawer__label-inline">Rodada:</div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {state?.round ?? '?'}
          </AntAvatar>
        </div>
        <div>
          <div className="game-info-drawer__label-inline">Pontos restantes para alguém ganhar:</div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {state?.pointsToVictory ?? '?'}
          </AntAvatar>
        </div>
        <Divider />
        <ul>
          {rankedPlayers.map((player, index) => {
            return (
              <div className="game-info-drawer__ranked-player" key={`ranked-${player.name}`}>
                {index + 1}.{' '}
                <Badge count={player.score} className="game-info-drawer__avatar-with-badge">
                  <Avatar id={player.avatarId} shape="square" />
                </Badge>
                {player.name}, {AVATAR_DESCRIPTIONS_BR[player.avatarId]}
              </div>
            );
          })}
        </ul>
      </Drawer>
    </Fragment>
  );
}

export default GameInfoDrawer;
