import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
// Design Resources
import { Avatar as AntAvatar, Table } from 'antd';

export function SectionMeta({ round, roundsToEndGame, groupScore, pointsToVictory, isTeamGame, teams }) {
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
          <div className="game-info-drawer__label-inline">Pontos:</div>
          <Table
            size="small"
            pagination={false}
            className
            columns={Object.entries(teams).map(([teamId, teamObj]) => ({
              title: teamObj?.name ?? teamId,
              dataIndex: teamId,
              key: teamId,
              align: 'center',
            }))}
            dataSource={Object.entries(teams).reduce(
              (acc, [teamId, teamObj]) => {
                acc[0][teamId] = teamObj.score;
                return acc;
              },
              [{}]
            )}
          />
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

SectionMeta.propTypes = {
  groupScore: PropTypes.number,
  isTeamGame: PropTypes.bool,
  pointsToVictory: PropTypes.number,
  round: PropTypes.number,
  roundsToEndGame: PropTypes.number,
  teams: PropTypes.objectOf(
    PropTypes.shape({
      score: PropTypes.number,
    })
  ),
};
