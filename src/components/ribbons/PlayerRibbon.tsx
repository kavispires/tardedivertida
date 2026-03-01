import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getAnimationClass, getAvatarColorById } from 'utils/helpers';
// Components
import { PlayerAvatar } from 'components/player';
// Sass
import styles from './Ribbons.module.scss';

type RibbonProps = {
  player: GamePlayer;
  position?: 'absolute' | 'static';
};

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
