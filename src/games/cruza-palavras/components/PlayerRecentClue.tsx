// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { GridCell } from '../utils/types';
// Components
import { Translate } from 'components/language';
import { TextHighlight, Title } from 'components/text';

type PlayerRecentClueProps = {
  user: GamePlayer;
  grid: GridCell[];
};

export function PlayerRecentClue({ user, grid }: PlayerRecentClueProps) {
  const cell = grid[user.coordinate];

  if (!user.clue || !cell) {
    return <></>;
  }

  return (
    <Space className="space-container" direction="vertical">
      <Title size="xx-small">
        <Translate pt="Sua dica" en="Your clue" />
      </Title>
      <span>
        <TextHighlight>{cell.xText}</TextHighlight> + <TextHighlight>{cell.yText}</TextHighlight> ={' '}
        <TextHighlight>{user.clue}</TextHighlight>
      </span>
    </Space>
  );
}
