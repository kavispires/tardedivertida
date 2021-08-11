import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
// Design Resources
import { Avatar as AntAvatar, Table } from 'antd';
import { Translate } from '../../shared';

export function SectionMeta({ round, roundsToEndGame, groupScore, pointsToVictory, isTeamGame, teams }) {
  return (
    <ul className="game-info-drawer__meta">
      {/* TODO: Remove after migration is complete */}
      {typeof round === 'number' ? (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Rodada:" en="Round:" />
          </div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {round}
          </AntAvatar>
          {Boolean(roundsToEndGame) && (
            <Fragment>
              <span className="game-info-drawer__inline-separator">
                <Translate pt="de" en="out of" />
              </span>
              <AntAvatar className="game-info-drawer__round" size="small">
                {round + roundsToEndGame}
              </AntAvatar>
            </Fragment>
          )}
        </li>
      ) : (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Rodada:" en="Round:" />
          </div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {round?.current}
          </AntAvatar>
          {Boolean(round?.total) && (
            <Fragment>
              <span className="game-info-drawer__inline-separator">
                <Translate pt="de" en="out of" />
              </span>
              <AntAvatar className="game-info-drawer__round" size="small">
                {round?.total}
              </AntAvatar>
            </Fragment>
          )}
        </li>
      )}

      {Boolean(groupScore) && (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
          <AntAvatar className="game-info-drawer__round" size="default" style={{ backgroundColor: 'gold' }}>
            {groupScore ?? 0}
          </AntAvatar>
        </li>
      )}

      {Boolean(teams) && (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
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
            <Translate
              pt={`Pontos restantes para ${isTeamGame ? 'um time' : 'alguém'} ganhar:`}
              en={`Points left for ${isTeamGame ? 'a team' : 'someone'} to win:`}
            />
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
  round: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ current: PropTypes.number, total: PropTypes.number }),
  ]),
  roundsToEndGame: PropTypes.number,
  teams: PropTypes.objectOf(
    PropTypes.shape({
      score: PropTypes.number,
    })
  ),
};
