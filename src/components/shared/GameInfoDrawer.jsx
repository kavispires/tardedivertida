import React, { Fragment, useMemo, useState } from 'react';
// Design Resources
import { Affix, Avatar as AntAvatar, Badge, Button, Divider, Drawer } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Utils
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';
// Components
import Avatar from '../avatars/Avatar';
import RulesModal from '../modals/RulesModal';

function SectionMe({ player, isTeamGame }) {
  return (
    <div className="game-info-drawer__section-me">
      <div className="game-info-drawer__label">Você é{isTeamGame && ` do time ${player?.team ?? '?'}`}</div>
      <div className="game-info-drawer__me">
        <Badge count={player.score} className="game-info-drawer__avatar-with-badge">
          <Avatar id={player.avatarId} shape="square" />
        </Badge>
        {player.name}, {AVATAR_DESCRIPTIONS_BR[player.avatarId]}
      </div>
    </div>
  );
}

function SectionMeta({ round, roundsToEndGame, groupScore, pointsToVictory, isTeamGame, teams }) {
  return (
    <ul className="game-info-drawer__meta">
      <li className="game-info-drawer__meta-item">
        <div className="game-info-drawer__label-inline">Rodada:</div>
        <AntAvatar className="game-info-drawer__round" size="small">
          {round}
        </AntAvatar>
        {Boolean(roundsToEndGame) && !isNaN(round) && (
          <Fragment>
            <span className="game-info-drawer__inline-separator">de</span>
            <AntAvatar className="game-info-drawer__round" size="small">
              {round + roundsToEndGame}
            </AntAvatar>
          </Fragment>
        )}
      </li>

      {Boolean(groupScore) && (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">Pontos:</div>
          <AntAvatar className="game-info-drawer__round" size="default" style={{ backgroundColor: 'gold' }}>
            {groupScore ?? 0}
          </AntAvatar>
        </li>
      )}

      {Boolean(teams) && (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">Pontos A vs B:</div>
          <AntAvatar className="game-info-drawer__round" size="default">
            {teams?.A?.score ?? '?'}
          </AntAvatar>
          <span className="game-info-drawer__inline-separator">vs</span>
          <AntAvatar className="game-info-drawer__round" size="default">
            {teams?.B?.score ?? '?'}
          </AntAvatar>
        </li>
      )}

      {Boolean(pointsToVictory) && (
        <div>
          <div className="game-info-drawer__label-inline">
            Pontos restantes para {isTeamGame ? 'um time' : 'alguém'} ganhar:
          </div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {pointsToVictory}
          </AntAvatar>
        </div>
      )}
    </ul>
  );
}

function SectionTeams({ players, teams }) {
  return (
    <div className="game-info-drawer__team-players">
      {Object.values(teams).map((team) => (
        <SectionTeamPlayers key={team.name} team={team} players={players} />
      ))}
    </div>
  );
}

function SectionTeamPlayers({ team, players }) {
  const sortedPlayers = useMemo(
    () =>
      team.members
        .map((memberName) => {
          return players[memberName];
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
    [players, team]
  );

  return (
    <div className="game-info-drawer__team" key={team.name}>
      <h3>Team {team.name}</h3>
      <ul>
        {sortedPlayers.map((player, index) => {
          return (
            <div className="game-info-drawer__ranked-player" key={`ranked-${player.name}`}>
              <Avatar id={player.avatarId} shape="square" className="game-info-drawer__avatar-with-badge" />
              {player.name}, {AVATAR_DESCRIPTIONS_BR[player.avatarId]}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

function SectionRankedPlayers({ players }) {
  const rankedPlayers = useMemo(() => Object.values(players).sort((a, b) => (a.score < b.score ? 1 : -1)), [
    players,
  ]);
  return (
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
  );
}

function GameInfoDrawer({ players, state, info, me }) {
  const [visible, setVisible] = useState(false);

  if (state.phase === 'LOBBY') {
    return <></>;
  }

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const completeMe = players?.[me] ?? {};
  const isTeamGame = Boolean(completeMe?.team) && Boolean(state.teams);

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
        {completeMe && <SectionMe player={completeMe} isTeamGame={isTeamGame} />}

        <Divider />

        <RulesModal gameInfo={info} />

        <Divider />

        <SectionMeta
          round={state?.round || '?'}
          roundsToEndGame={state?.roundsToEndGame}
          groupScore={state?.groupScore}
          pointsToVictory={state?.pointsToVictory}
          isTeamGame={isTeamGame}
          teams={state?.teams}
        />

        <Divider />

        {isTeamGame ? (
          <SectionTeams players={players} teams={state?.teams} />
        ) : (
          <SectionRankedPlayers players={players} />
        )}
      </Drawer>
    </Fragment>
  );
}

export default GameInfoDrawer;
