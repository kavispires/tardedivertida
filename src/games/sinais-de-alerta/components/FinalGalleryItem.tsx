// Ant Design Resources
import { Progress, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { FinalGalleryEntry } from '../utils/types';
import { WarningDrawing } from './WarningDrawing';

type FinalGalleryItemProps = {
  entry: FinalGalleryEntry;
  players: GamePlayers;
  width: number;
};

export function FinalGalleryItem({ entry, players, width }: FinalGalleryItemProps) {
  const player = players[entry.playerId];
  const playerColor = getAvatarColorById(player.avatarId);

  return (
    <SpaceContainer vertical contained>
      <PlayerAvatarName player={player} />
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
    </SpaceContainer>
  );
}
