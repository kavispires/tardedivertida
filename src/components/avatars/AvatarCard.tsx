import clsx from 'clsx';
// Resources
import { AVATARS } from 'utils/constants';
// Hooks
import { useGlobalState, useLanguage } from 'hooks';
// Components
import { Avatar } from './Avatar';

type AvatarCardProps = {
  player: GamePlayer;
  size?: 'small' | 'default' | 'large';
  className?: string;
  withName?: boolean;
  withDescription?: boolean;
  uppercase?: boolean;
  addressUser?: boolean;
  replacementAvatar?: any;
};

export const AvatarCard = ({
  player,
  size = 'default',
  className = '',
  withName = false,
  withDescription = false,
  uppercase = false,
  addressUser = false,
  replacementAvatar,
}: AvatarCardProps) => {
  const [userId] = useGlobalState('userId');
  const { language, translate } = useLanguage();

  const baseClass = 'avatar-card';

  const isUser = player.id === userId;
  const addressedUser = translate('Você', 'You');

  const sizes = getSize(size);

  const avatar = AVATARS[player.avatarId];

  return (
    <div
      className={clsx(baseClass, uppercase && `${baseClass}--uppercase`, `${baseClass}--${size}`, className)}
      style={{ backgroundColor: avatar.color, width: sizes.width }}
    >
      {replacementAvatar ? (
        replacementAvatar
      ) : (
        <Avatar
          id={player.avatarId}
          className="avatar-card__avatar"
          shape="square"
          style={{ width: sizes.avatarSize, height: sizes.avatarSize }}
        />
      )}
      {withName && (
        <>
          <div className="avatar-card__name">{addressUser && isUser ? addressedUser : player.name}</div>
          {size !== 'small' && withDescription && (
            <div className="avatar-card__description">{avatar.description[language]}</div>
          )}
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
        width: '10ch',
        avatarSize: '6ch',
      };
    case 'large':
      return {
        width: '20ch',
        avatarSize: '24ch',
      };
    default:
      return {
        width: '14ch',
        avatarSize: '12ch',
      };
  }
};
