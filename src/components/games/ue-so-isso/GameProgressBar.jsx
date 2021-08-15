import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Progress } from 'antd';
// Components
import { Translate } from '../../shared';

export function GameProgressBar({ groupScore, currentRound, totalRounds }) {
  const totalProgress = Math.round((100 * (currentRound - 1)) / totalRounds);

  return (
    <div className="u-word-selection-phase__game-progress-bar">
      <Translate pt="Progresso:" en="Group Progress" />
      <br />
      <Progress
        percent={totalProgress}
        success={{ percent: groupScore ?? 0, strokeColor: '#bbec6c' }}
        status="active"
        strokeColor="#fe646f"
      />
    </div>
  );
}

GameProgressBar.propTypes = {
  currentRound: PropTypes.number,
  groupScore: PropTypes.number,
  totalRounds: PropTypes.number,
};
