import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { CrownFilled } from '@ant-design/icons';
// Hooks
import { useDimensions } from '../../hooks';
// Utils
import { inNSeconds, orderBy } from '../../utils';
// Components
import { Avatar } from '../avatars';

export function RankingBoard({ players, ranking }) {
  const [displayStep, setDisplayStep] = useState(0);
  const [sortedRanking, setSortedRanking] = useState([]);
  const [reRank, setReRank] = useState(0);
  const [, height] = useDimensions('ranking-row-0');

  const maxPoints = ranking[0].newScore;

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(4),
    autoStart: true,
    onExpire: () => setReRank(1),
  });

  // Rank by previousScore
  useEffect(() => {
    const positions = {};
    let lastPosition = 0;
    let lastPoints = null;

    const rankByFinalScoreDict = orderBy(ranking, ['newScore', 'name'], ['desc', 'asc']).reduce(
      (acc, entry, index) => {
        acc[entry.playerId] = index;
        // Calculate position
        if (lastPoints === null || entry.newScore < lastPoints) {
          lastPoints = entry.newScore;
          lastPosition += 1;
        }
        positions[entry.playerId] = [0, lastPosition];
        return acc;
      },
      {}
    );

    const rankByPreviousScore = orderBy(ranking, ['previousScore', 'name'], ['desc', 'asc']);

    // Reset position trackers
    lastPosition = 0;
    lastPoints = null;

    const tempSortedRanking = rankByPreviousScore.map((entry, index) => {
      const newEntry = { ...entry };

      newEntry.order = [index, rankByFinalScoreDict[newEntry.playerId]];
      newEntry.position = positions[newEntry.playerId];
      // Calculate position
      if (lastPoints === null || entry.previousScore < lastPoints) {
        lastPoints = entry.previousScore;
        lastPosition += 1;
      }
      newEntry.position[0] = lastPosition;
      return newEntry;
    });

    setSortedRanking(tempSortedRanking);
  }, []); // eslint-disable-line

  // Show gained points
  useEffect(() => {
    if (seconds === 3) {
      setDisplayStep(1);
    } else if (seconds === 2) {
      setDisplayStep(2);
    }
  }, [seconds]);

  return (
    <div
      className="ranking-board"
      style={{ height: `${(Math.max(60, height) + 8) * sortedRanking.length}px` }}
    >
      {sortedRanking.map((entry, index) => {
        const { playerId, newScore, previousScore, gainedPoints, order, position } = entry;
        const hPosition = (Math.max(60, height) + 8) * (order[reRank] ?? 0);
        return (
          <div
            className={`ranking-board__row ranking-board__row--${index}`}
            key={`ranking-${playerId}`}
            id={`ranking-row-${index}`}
            style={{ top: `${hPosition}px` }}
          >
            <div className="ranking-board__cell-crown">
              {newScore > 0 && maxPoints === newScore && displayStep >= 3 && (
                <CrownFilled className="ranking-board__crown-icon" />
              )}
            </div>
            <div className="ranking-board__cell-position">#{position[reRank] ?? ''}</div>
            <div className="ranking-board__cell-player">
              <div className="ranking-board__avatar">
                <Avatar id={players[playerId].avatarId} />
              </div>
              <div className="ranking-board__name">{players[playerId].name}</div>
            </div>
            <div className="ranking-board__cell-points">{previousScore}</div>
            {displayStep >= 1 && gainedPoints !== undefined && (
              <div className="ranking-board__cell-points-plus">+{gainedPoints}</div>
            )}
            {displayStep >= 2 && <div className="ranking-board__cell-points-total">{newScore}</div>}
          </div>
        );
      })}
    </div>
  );
}

RankingBoard.propTypes = {
  players: PropTypes.object,
  ranking: PropTypes.arrayOf(
    PropTypes.shape({
      playerId: PropTypes.string,
      previousScore: PropTypes.number,
      gainedPoints: PropTypes.number,
      newScore: PropTypes.number,
    })
  ),
};

export default RankingBoard;
