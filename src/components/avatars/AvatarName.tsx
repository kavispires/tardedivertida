import clsx from 'clsx';
// Resources
import { AVATARS as avatars } from '../../utils/constants';
// Hooks
import { useGlobalState, useLanguage } from '../../hooks';
// Components
import { Avatar } from './Avatar';
import { translate } from '../shared';

type AvatarNameProps = {
  player: GamePlayer;
  size?: 'small' | 'default' | 'large';
  className?: string;
  withDescription?: boolean;
  uppercase?: boolean;
  addressUser?: boolean;
};

const AVATARS: PlainObject = avatars;

export const AvatarName = ({
  player,
  size = 'default',
  className = '',
  withDescription = false,
  uppercase = false,
  addressUser = false,
}: AvatarNameProps) => {
  const [userId] = useGlobalState('userId');
  const language = useLanguage();

  const baseClass = 'avatar-name';

  const isUser = player.id === userId;
  const addressedUser = translate('VOCÊ', 'YOU', language);

  return (
    <span
      className={clsx(baseClass, `${baseClass}--${size}`, uppercase && `${baseClass}--uppercase`, className)}
    >
      <Avatar id={player.avatarId} className="avatar-name__avatar" size={size} />
      <span className="avatar-name__name">{addressUser && isUser ? addressedUser : player.name}</span>
      {withDescription && (
        <span className="avatar-name__name">, {AVATARS[player.avatarId].description[language]}</span>
      )}
    </span>
  );
};
