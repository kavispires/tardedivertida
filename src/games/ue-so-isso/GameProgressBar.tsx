// Ant Design Resources
import { Progress } from 'antd';
// Components
import { Translate } from 'components';

type GameProgressBarProps = {
  groupScore: number;
  round: GameRound;
};

export function GameProgressBar({ groupScore, round }: GameProgressBarProps) {
  const totalProgress = Math.round((100 * (round.current - 1)) / round.total);

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
