import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { CrownFilled } from '@ant-design/icons';
// Hooks
import { useDimensions } from '../../hooks';
// Utils
import { inNSeconds } from '../../utils/helpers';
// Components
import { Avatar } from '../avatars';
import clsx from 'clsx';

type GainedPointProps = {
  gainedPoint: number;
  order: number;
};

function GainedPoint({ gainedPoint, order }: GainedPointProps): JSX.Element {
  return (
    <li
      className={clsx(
        'ranking-board__gained-point',
        gainedPoint > 0 && 'ranking-board__gained-point--plus',
        gainedPoint < 0 && 'ranking-board__gained-point--minus',
        `ranking-board__gained-point--${order}`
      )}
    >
      {gainedPoint > 0 ? '+' : ''}
      {gainedPoint}
    </li>
  );
}

type GainedPointsProps = {
  gainedPoints: number[] | number;
  playerId: PlayerId;
};

function GainedPoints({ gainedPoints, playerId }: GainedPointsProps): JSX.Element {
  const points = Array.isArray(gainedPoints) ? gainedPoints : [gainedPoints];
  return (
    <ul className="ranking-board__cell-gained-points">
      {points.map((gainedPoint, index) => (
        <GainedPoint key={`gained-point-${playerId}-${index}`} gainedPoint={gainedPoint} order={index} />
      ))}
    </ul>
  );
}

type RankingBoardProps = {
  players: GamePlayers;
  ranking: GameRanking;
};

export function RankingBoard({ players, ranking }: RankingBoardProps): JSX.Element {
  const [displayStep, setDisplayStep] = useState(0);
  const [sortedRanking, setSortedRanking] = useState<GameRanking>([]);
  const [reRank, setReRank] = useState(0);
  const [, height] = useDimensions('ranking-row-0');

  const maxPoints = ranking[0].newScore;

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(5),
    autoStart: true,
    onExpire: () => setReRank(1),
  });

  // Rank by previousScore
  useEffect(() => {
    const positions: PlainObject = {};
    let lastPosition = 0;
    let lastPoints = 0;

    const rankByFinalScoreDict = orderBy(ranking, ['newScore', 'name'], ['desc', 'asc']).reduce(
      (acc: PlainObject, entry, index) => {
        acc[entry.playerId] = index;
        // Calculate position
        if (lastPoints === 0 || entry.newScore < lastPoints) {
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
    lastPoints = 0;

    const tempSortedRanking: GameRanking = rankByPreviousScore.map((entry, index) => {
      const newEntry = { ...entry };

      newEntry.order = [index, rankByFinalScoreDict[newEntry.playerId]];
      newEntry.position = positions[newEntry.playerId];
      // Calculate position
      if (lastPoints === 0 || entry.previousScore < lastPoints) {
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
    if (seconds === 4) {
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
              <GainedPoints gainedPoints={gainedPoints} playerId={playerId} />
            )}
            {displayStep >= 2 && <div className="ranking-board__cell-points-total">{newScore}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default RankingBoard;
