import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { CrownFilled } from '@ant-design/icons';
// Utils
import { inNSeconds } from '../../utils';
// Components
import Avatar from '../avatars/Avatar';

function RankingBoard({ players, ranking }) {
  const [displayStep, setDisplayStep] = useState(0);
  const [sortedRanking, setSortedRanking] = useState([]);
  const [positions, setPositions] = useState([]);

  const maxPoints = ranking[0].newScore;

  const rankByFinalScore = () => {
    setSortedRanking(ranking.sort((a, b) => (a.newScore < b.newScore ? 1 : -1)));
    setDisplayStep(3);
  };

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(4),
    autoStart: true,
    onExpire: () => rankByFinalScore(),
  });

  // Rank by previousScore
  useEffect(() => {
    setSortedRanking(ranking.sort((a, b) => (a.previousScore < b.previousScore ? 1 : -1)));
  }, []); // eslint-disable-line

  // Show gained points
  useEffect(() => {
    if (seconds === 3) {
      setDisplayStep(1);
    } else if (seconds === 2) {
      setDisplayStep(2);
    }
  }, [seconds]);

  // Determine position number in rank
  useEffect(() => {
    const property = displayStep < 3 ? 'previousScore' : 'newScore';

    let lastPosition = 1;
    let lastPoints = sortedRanking?.[0]?.[property] ?? 0;
    setPositions(
      sortedRanking.map((entry) => {
        if (entry[property] < lastPoints) {
          lastPoints = entry[property];
          lastPosition += 1;
        }

        return lastPosition;
      })
    );
  }, [sortedRanking, displayStep]);

  return (
    <div className="ranking-board">
      {sortedRanking.map((entry, index) => {
        const { playerName, newScore, previousScore, gainedPoints } = entry;
        return (
          <div className={`ranking-board__row ranking-board__row--${index}`} key={`ranking-${playerName}`}>
            <div className="ranking-board__cell-crown">
              {newScore > 0 && maxPoints === newScore && displayStep >= 3 && (
                <CrownFilled className="ranking-board__crown-icon" />
              )}
            </div>
            <div className="ranking-board__cell-position">#{positions?.[index] ?? ''}</div>
            <div className="ranking-board__cell-player">
              <div className="ranking-board__avatar">
                <Avatar id={players[playerName].avatarId} />
              </div>
              <div className="ranking-board__name">{playerName}</div>
            </div>
            <div className="ranking-board__cell-points">{previousScore}</div>
            {displayStep >= 1 && <div className="ranking-board__cell-points-plus">+{gainedPoints}</div>}
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
      playerName: PropTypes.string,
      previousScore: PropTypes.number,
      gainedPoints: PropTypes.number,
      newScore: PropTypes.number,
    })
  ),
};

export default RankingBoard;
