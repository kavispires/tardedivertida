// Ant Design Resources
import { type AvatarProps, Tooltip, type TooltipProps } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Internal
import { Avatar } from './Avatar';

type AvatarTooltipProps = {
  player: GamePlayer;
  tooltipProps?: TooltipProps;
} & AvatarProps;

export function AvatarTooltip({ player, tooltipProps, ...avatarProps }: AvatarTooltipProps) {
  return (
    <Tooltip title={player.name} {...tooltipProps}>
      <Avatar id={player.avatarId} {...avatarProps} />
    </Tooltip>
  );
}
