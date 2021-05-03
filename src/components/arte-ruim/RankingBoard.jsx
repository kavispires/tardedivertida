import React from 'react';
// Design Resources
import { CrownFilled } from '@ant-design/icons';
// Components
import Avatar from '../avatars/Avatar';

function RankingBoard({ players, ranking }) {
  return (
    <div className="ranking-board">
      {ranking.map((entry, index) => {
        const { playerName, newScore, previousScore, gainedPoints } = entry;
        return (
          <div className="ranking-board__row">
            <div className="ranking-board__cell-crown">
              {index === 0 && newScore > 0 && <CrownFilled className="ranking-board__crown-icon" />}
            </div>
            <div className="ranking-board__cell-position">#{index + 1}</div>
            <div className="ranking-board__cell-player">
              <div className="ranking-board__avatar">
                <Avatar id={players[playerName].avatarId} />
              </div>
              <div className="ranking-board__name">{playerName}</div>
            </div>
            <div className="ranking-board__cell-points">{previousScore}</div>
            <div className="ranking-board__cell-points-plus">+{gainedPoints}</div>
            <div className="ranking-board__cell-points-total">{newScore}</div>
          </div>
        );
      })}
    </div>
  );
}

export default RankingBoard;
