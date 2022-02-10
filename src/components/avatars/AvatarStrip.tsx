import clsx from 'clsx';
// Hooks
import { useGlobalState, useLanguage } from '../../hooks';
// Components
import { Avatar } from './Avatar';
import { getAvatarColorById } from '../../utils/helpers';

type AvatarStripProps = {
  player: GamePlayer;
  size?: 'small' | 'default' | 'large';
  className?: string;
  withName?: boolean;
  uppercase?: boolean;
  addressUser?: boolean;
};

export const AvatarStrip = ({
  player,
  size = 'default',
  className = '',
  withName = false,
  uppercase = false,
  addressUser = false,
}: AvatarStripProps) => {
  const [userId] = useGlobalState('userId');
  const { translate } = useLanguage();

  const baseClass = 'avatar-strip';

  const isUser = player.id === userId;
  const addressedUser = translate('Você', 'You');

  const sizes = getSize(size);

  return (
    <div
      className={clsx(baseClass, uppercase && `${baseClass}--uppercase`, `${baseClass}--${size}`, className)}
      style={{ backgroundColor: getAvatarColorById(player.avatarId), width: sizes.width }}
    >
      <Avatar
        id={player.avatarId}
        className="avatar-strip__avatar"
        shape="square"
        style={{ width: sizes.avatarSize, height: sizes.avatarSize }}
      />
      {withName && (
        <>
          <div className="avatar-strip__name">{addressUser && isUser ? addressedUser : player.name}</div>
        </>
      )}
    </div>
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
