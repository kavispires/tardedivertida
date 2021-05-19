import React, { Fragment, useState } from 'react';
// Design Resources
import { Affix, Avatar as AntAvatar, Badge, Button, Divider, Drawer } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Utils
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';
// Components
import Avatar from '../avatars/Avatar';
import RulesModal from '../modals/RulesModal';

function GameInfoDrawer({ players, state, info, me }) {
  const [visible, setVisible] = useState(false);

  if (state.phase === 'LOBBY') {
    return <span></span>;
  }

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const completeMe = players?.[me];
  const rankedPlayers = Object.values(players).sort((a, b) => (a.score < b.score ? 1 : -1));
  const isTeamGame = Boolean(completeMe.team);

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
        {completeMe && (
          <Fragment>
            <div className="game-info-drawer__label">Você é{isTeamGame && ` do time ${completeMe.team}`}</div>
            <div className="game-info-drawer__me">
              <Badge count={completeMe.score} className="game-info-drawer__avatar-with-badge">
                <Avatar id={completeMe.avatarId} shape="square" />
              </Badge>
              {completeMe.name}, {AVATAR_DESCRIPTIONS_BR[completeMe.avatarId]}
            </div>
          </Fragment>
        )}
        <Divider />
        <RulesModal gameInfo={info} />
        <Divider />
        <div>
          <div className="game-info-drawer__label-inline">Rodada:</div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {state?.round ?? '?'}
          </AntAvatar>
        </div>
        {Boolean(state?.teamScore) && (
          <div>
            <div className="game-info-drawer__label-inline">Pontos:</div>
            <AntAvatar className="game-info-drawer__round" size="small">
              {state?.teamScore ?? '?'}
            </AntAvatar>
          </div>
        )}

        {Boolean(state?.pointsToVictory) && (
          <div>
            <div className="game-info-drawer__label-inline">
              Pontos restantes para {isTeamGame ? 'alguém' : 'um time'} ganhar:
            </div>
            <AntAvatar className="game-info-drawer__round" size="small">
              {state?.pointsToVictory ?? '?'}
            </AntAvatar>
          </div>
        )}

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
