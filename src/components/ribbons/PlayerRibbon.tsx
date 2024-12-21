import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getAnimationClass, getAvatarColorById } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';

type RibbonProps = {
  player: GamePlayer;
  position?: 'absolute' | 'static';
};

export function PlayerRibbon({ player, position = 'absolute' }: RibbonProps) {
  return (
    <div className={clsx('ribbon', `ribbon--${position}`)}>
      <div
        className={clsx('ribbon__content', getAnimationClass('bounceIn'))}
        style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
      >
        <Tooltip title={player.name}>
          <Avatar id={player.avatarId} size="small" />
        </Tooltip>
      </div>
    </div>
  );
}
