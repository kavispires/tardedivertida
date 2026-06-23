import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Utils
import { getAnimationClass, getAvatarColorById } from '@utils/helpers';
// Components
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Sass
import styles from './Ribbons.module.scss';

type RibbonProps = {
  player: GamePlayer;
  position?: 'absolute' | 'static';
};

/**
 * Ribbon component displaying a player's name and avatar with bounce animation
 */
export function PlayerRibbon({ player, position = 'absolute' }: RibbonProps) {
  return (
    <div className={clsx(styles.ribbon, position === 'absolute' && styles.ribbonAbsolute)}>
      <div
        className={clsx(styles.ribbonContent, getAnimationClass('bounceIn'))}
        style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
      >
        <Tooltip title={player.name}>
          <PlayerAvatar
            avatarId={player.avatarId}
            size="small"
          />
        </Tooltip>
      </div>
    </div>
  );
}
