import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Internal
import { PlayerAvatar } from './PlayerAvatar';
import { IconAvatar } from './IconAvatar';
// Sass
import './PlayerAvatarStrip.scss';

type PlayerAvatarStripProps = {
  /**
   * A player instance
   */
  player: GamePlayer;
  /**
   * The strip size
   */
  size?: 'small' | 'default' | 'large';
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Indicates if the player name should be displayed
   */
  withName?: boolean;
  /**
   * If text should be displayed in uppercase
   */
  uppercase?: boolean;
  /**
   * Displays YOU/VOCÊ if player is the user
   */
  addressUser?: boolean;
  /**
   * The icon to replace the player's avatar
   */
  icon?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 *  Displays a player avatar with optional name in a strip layout
 */
export const PlayerAvatarStrip = ({
  player,
  size = 'default',
  className = '',
  withName = false,
  uppercase = false,
  addressUser = false,
  icon,
  ...rest
}: PlayerAvatarStripProps) => {
  const [userId] = useGlobalState('userId');
  const { translate } = useLanguage();

  const baseClass = 'avatar-strip';

  const isUser = player.id === userId;
  const addressedUser = translate('Você', 'You');

  const sizes = getSize(size);

  return (
    <Tooltip title={player.name} placement="right">
      <div
        {...rest}
        className={clsx(
          baseClass,
          uppercase && `${baseClass}--uppercase`,
          `${baseClass}--${size}`,
          className,
        )}
        style={{
          backgroundColor: getAvatarColorById(player.avatarId),
          width: sizes.width,
          ...(rest.style ?? {}),
        }}
      >
        {icon ? (
          <IconAvatar style={{ width: sizes.avatarSize, height: sizes.avatarSize }} icon={icon} />
        ) : (
          <PlayerAvatar
            avatarId={player.avatarId}
            className="avatar-strip__avatar"
            shape="square"
            style={{ width: sizes.avatarSize, height: sizes.avatarSize }}
          />
        )}
        {withName && (
          <div className="avatar-strip__name">{addressUser && isUser ? addressedUser : player.name}</div>
        )}
      </div>
    </Tooltip>
  );
};

/**
 * Output css size parameters for given size
 * @param size
 * @returns
 */
const getSize = (size: 'small' | 'default' | 'large') => {
  switch (size) {
    case 'small':
      return {
        width: '4ch',
        avatarSize: '2ch',
      };
    case 'large':
      return {
        width: '8ch',
        avatarSize: '6ch',
      };
    default:
      return {
        width: '6ch',
        avatarSize: '4ch',
      };
  }
};
