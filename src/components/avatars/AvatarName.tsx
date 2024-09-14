import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { AVATARS } from 'utils/avatars';
// Internal
import { Avatar } from './Avatar';
// Sass
import './AvatarName.scss';
// Resources

type AvatarNameProps = {
  /**
   * A player instance
   */
  player: GamePlayer;
  /**
   * The component size
   */
  size?: 'small' | 'default' | 'large';
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Indicates if the description (animal type) should be displayed
   */
  withDescription?: boolean;
  /**
   * If text should be displayed in uppercase
   */
  uppercase?: boolean;
  /**
   * Displays YOU/VOCÊ if player is the user
   */
  addressUser?: boolean;
  /**
   * Change the name direction to upright
   */
  upright?: boolean;
};

export const AvatarName = ({
  player,
  size = 'small',
  className = '',
  withDescription = false,
  uppercase = false,
  addressUser = false,
  upright = false,
}: AvatarNameProps) => {
  const [userId] = useGlobalState('userId');
  const { language, translate } = useLanguage();

  const baseClass = 'avatar-name';

  const isUser = player.id === userId;
  const addressedUser = translate('VOCÊ', 'YOU');

  return (
    <span
      className={clsx(
        baseClass,
        uppercase && `${baseClass}--uppercase`,
        upright && `${baseClass}--upright`,
        className
      )}
    >
      <Avatar id={player.avatarId} className="avatar-name__avatar" size={size} />
      <span className="avatar-name__name">{addressUser && isUser ? addressedUser : player.name}</span>
      {withDescription && (
        <span className="avatar-name__name">, {AVATARS[player.avatarId].description[language]}</span>
      )}
    </span>
  );
};
