import { GamePlayers } from 'types/player';
import { FinalGalleryEntry } from '../utils/types';
import { Progress, Space, Typography } from 'antd';
import { AvatarName } from 'components/avatars';
import { WarningDrawing } from './WarningDrawing';
import { getAvatarColorById } from 'utils/helpers';

type FinalGalleryItemProps = {
  entry: FinalGalleryEntry;
  players: GamePlayers;
  width: number;
};

export function FinalGalleryItem({ entry, players, width }: FinalGalleryItemProps) {
  const player = players[entry.playerId];
  const playerColor = getAvatarColorById(player.avatarId);

  return (
    <Space direction="vertical" className="space-container contained">
      <AvatarName player={player} />
      <WarningDrawing drawing={entry.drawing} width={width} />
      <Typography.Text code className="uppercase">
        {entry.title}
      </Typography.Text>

      <Progress
        percent={entry.accuracy * 100}
        size="small"
        style={{ width: width }}
        strokeColor={playerColor}
      />
    </Space>
  );
}
