import { ReactNode } from 'react';
import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { AVATARS } from 'utils/avatars';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Avatar } from './Avatar';
// Sass
import './AvatarCard.scss';

type AvatarCardProps = {
  /**
   * A player instance
   */
  player: GamePlayer;
  /**
   * Displays YOU/VOCÊ if player is the user
   */
  addressUser?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Replaces the regular Avatar
   */
  replacementAvatar?: ReactNode;
  /**
   * The card size
   */
  size?: 'small' | 'default' | 'large';
  /**
   * If text should be displayed in uppercase
   */
  uppercase?: boolean;
  /**
   * Indicates if the description (animal type) should be displayed
   */
  withDescription?: boolean;
  /**
   * Indicates if the player name should be displayed
   */
  withName?: boolean;
  /**
   * Rounds the corners of the card
   */
  withRoundCorners?: boolean;
};

export const AvatarCard = ({
  player,
  addressUser = false,
  className = '',
  replacementAvatar,
  size = 'default',
  uppercase = false,
  withName = false,
  withDescription = false,
  withRoundCorners = false,
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
      className={clsx(
        baseClass,
        uppercase && `${baseClass}--uppercase`,
        `${baseClass}--${size}`,
        withRoundCorners && `${baseClass}--round-corners`,
        className
      )}
      style={{ backgroundColor: avatar?.color, width: sizes.width }}
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
