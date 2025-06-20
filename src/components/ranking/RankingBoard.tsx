import clsx from 'clsx';
import { orderBy } from 'lodash';
import { type LegacyRef, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useEffectOnce, useMeasure } from 'react-use';
// Ant Design Resources
import { CrownFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Types
import type { GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { getAnimationClass, removeDuplicates } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';

type GainedPointProps = {
  gainedPoint: number;
  order: number;
  description?: ReactNode;
};

function GainedPoint({ gainedPoint, order, description }: GainedPointProps) {
  const isPositive = gainedPoint > 0;
  const isNegative = gainedPoint < 0;
  return (
    <li
      className={clsx(
        'ranking-board__gained-point',
        isPositive && 'ranking-board__gained-point--plus',
        isNegative && 'ranking-board__gained-point--minus',
        `ranking-board__gained-point--${order}`,
      )}
    >
      <Tooltip
        title={description ?? <Translate pt="Pontos ganhos" en="Gained Points" />}
        color={isPositive ? 'gold' : isNegative ? 'red' : 'gray'}
      >
        {isPositive ? '+' : ''}
        {gainedPoint}
      </Tooltip>
    </li>
  );
}

type GainedPointsProps = {
  gainedPoints: number[] | number;
  playerId: PlayerId;
  gainedPointsDescriptions?: ReactNode[];
};

function GainedPoints({ gainedPoints, playerId, gainedPointsDescriptions = [] }: GainedPointsProps) {
  const points = Array.isArray(gainedPoints) ? gainedPoints : [gainedPoints];
  return (
    <ul className="ranking-board__cell-gained-points">
      {points.map((gainedPoint, index) => (
        <GainedPoint
          key={`gained-point-${playerId}-${index}`}
          gainedPoint={gainedPoint}
          order={index}
          description={gainedPointsDescriptions[index]}
        />
      ))}
    </ul>
  );
}

type RankingBoardProps = {
  players: GamePlayers;
  ranking: GameRanking;
  gainedPointsDescriptions?: ReactNode[];
  hideGainedPoints?: boolean;
  delay?: number;
  victoryIndex?: number;
};

export function RankingBoard({
  players,
  ranking,
  gainedPointsDescriptions,
  hideGainedPoints = false,
  delay = 0,
  victoryIndex = 0,
}: RankingBoardProps) {
  const [displayStep, setDisplayStep] = useState(0);
  const [sortedRanking, setSortedRanking] = useState<GameRanking>([]);
  const [reRank, setReRank] = useState(0);
  const [ref, { height }] = useMeasure();

  const orderedPoints = useMemo(
    () => removeDuplicates(ranking.map((scores) => scores.newScore).sort((a, b) => b - a)),
    [ranking],
  );

  const { seconds } = useCountdown({
    duration: 5 + delay,
    autoStart: true,
    onExpire: () => {
      setReRank(1);
      setDisplayStep(3);
    },
  });

  // Rank by previousScore
  useEffectOnce(() => {
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
      {},
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
  });

  // Show gained points
  useEffect(() => {
    if (seconds === 4 + delay) {
      setDisplayStep(1);
    } else if (seconds === 2 + delay) {
      setDisplayStep(2);
    }
  }, [seconds, delay]);

  return (
    <div
      className={clsx(
        'ranking-board',
        seconds > 4 && 'ranking-board--hidden',
        seconds === 4 && getAnimationClass('fadeIn'),
      )}
      style={{
        height: `${(Math.max(60, height) + 8) * sortedRanking.length}px`,
      }}
    >
      <div
        className="ranking-board__row"
        id="ranking-row-placeholder"
        style={{ opacity: 0 }}
        ref={ref as LegacyRef<HTMLDivElement>}
      >
        <div className="ranking-board__cell-crown">
          <CrownFilled className="ranking-board__crown-icon" />
        </div>
        <div className="ranking-board__cell-position">#0</div>
        <div className="ranking-board__cell-player">
          <div className="ranking-board__avatar">
            <Avatar id="A" />
          </div>
          <div className="ranking-board__name">Placeholder</div>
        </div>
        <Tooltip title={<Translate pt="Pontos Anteriores" en="Previous Points" />} color="gray">
          <div className="ranking-board__cell-points">0</div>
        </Tooltip>

        <GainedPoints gainedPoints={0} playerId="A" />

        <Tooltip title="Total" color="gold">
          <span className="ranking-board__cell-points-total">0</span>
        </Tooltip>
      </div>

      {sortedRanking.map((entry, index) => {
        const { playerId, newScore, previousScore, gainedPoints, order, position } = entry;
        const hPosition = (Math.max(60, height) + 8) * (order[reRank] ?? 0);

        return (
          <div
            className={`ranking-board__row ranking-board__row--${index}`}
            key={`ranking-${playerId}`}
            // id={`ranking-row-${index}`}
            style={{ top: `${hPosition}px` }}
          >
            <div className="ranking-board__cell-crown">
              {orderedPoints[victoryIndex] === newScore && displayStep >= 3 && (
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
            <Tooltip title={<Translate pt="Pontos Anteriores" en="Previous Points" />} color="gray">
              <div className="ranking-board__cell-points">{previousScore}</div>
            </Tooltip>
            {!hideGainedPoints && displayStep >= 1 && gainedPoints !== undefined && (
              <GainedPoints
                gainedPoints={gainedPoints}
                playerId={playerId}
                gainedPointsDescriptions={gainedPointsDescriptions}
              />
            )}

            <Tooltip title="Total" color="gold">
              {displayStep >= 2 ? (
                <span className="ranking-board__cell-points-total">{newScore}</span>
              ) : (
                <span className="ranking-board__cell-points-total-preliminary">{newScore}</span>
              )}
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
