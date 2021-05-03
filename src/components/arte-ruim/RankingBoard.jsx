import React, { useCallback, useState } from 'react';
// Design Resources
import { Button, Layout, message, notification, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Components
import LoadingPage from '../loaders/LoadingPage';
import { ARTE_RUIM_API } from '../../adapters';
import { CrownFilled, RocketFilled } from '@ant-design/icons';
import Avatar from '../avatars/Avatar';

function RankingBoard({ players, ranking }) {
  // const { seconds, isRunning, pause, resume } = useTimer({
  //   expiryTimestamp: inNSeconds(10 * galleryLength),
  //   autoStart: true,
  // });
  console.table(ranking);

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
