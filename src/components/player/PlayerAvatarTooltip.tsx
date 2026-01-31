// Ant Design Resources
import { type AvatarProps, Tooltip, type TooltipProps } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Internal
import { PlayerAvatar } from './PlayerAvatar';

type PlayerAvatarTooltipProps = {
  player: GamePlayer;
  tooltipProps?: TooltipProps;
} & AvatarProps;

export function PlayerAvatarTooltip({ player, tooltipProps, ...avatarProps }: PlayerAvatarTooltipProps) {
  return (
    <Tooltip
      title={player.name}
      {...tooltipProps}
    >
      <PlayerAvatar
        avatarId={player.avatarId}
        {...avatarProps}
      />
    </Tooltip>
  );
}
