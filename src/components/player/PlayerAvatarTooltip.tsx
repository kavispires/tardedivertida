// Ant Design Resources
import { type AvatarProps, Tooltip, type TooltipProps } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Internal
import { PlayerAvatar } from './PlayerAvatar';

type PlayerAvatarTooltipProps = {
  /**
   * The player object containing avatar and name information
   */
  player: GamePlayer;
  /**
   * Additional props to pass to the Tooltip component
   */
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
