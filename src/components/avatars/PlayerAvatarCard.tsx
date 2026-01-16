import clsx from 'clsx';
import type { ReactNode } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import { PlayerAvatar } from './PlayerAvatar';
// Sass
import './PlayerAvatarCard.scss';

type PlayerAvatarCardProps = {
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
} & React.HTMLAttributes<HTMLDivElement>;

/**
 *  Displays a player avatar with optional name and description in a card layout
 */
export const PlayerAvatarCard = ({
  player,
  addressUser = false,
  className = '',
  replacementAvatar,
  size = 'default',
  uppercase = false,
  withName = false,
  withDescription = false,
  withRoundCorners = false,
  children,
}: PlayerAvatarCardProps) => {
  const [userId] = useGlobalState('userId');
  const { language } = useLanguage();

  const baseClass = 'avatar-card';

  const sizes = getSize(size);

  const avatar = AVATARS[player.avatarId];

  return (
    <div
      className={clsx(
        baseClass,
        {
          [`${baseClass}--uppercase`]: uppercase,
          [`${baseClass}--round-corners`]: withRoundCorners,
        },
        `${baseClass}--${size}`,
        className,
      )}
      style={{ backgroundColor: avatar?.color, width: sizes.width }}
    >
      {replacementAvatar ? (
        replacementAvatar
      ) : (
        <PlayerAvatar
          avatarId={player.avatarId}
          className="avatar-card__avatar"
          shape="square"
          style={{ width: sizes.avatarSize, height: sizes.avatarSize }}
        />
      )}
      {withName && (
        <>
          <div className="avatar-card__name">
            {addressUser && player.id === userId ? (
              <Translate
                en="You"
                pt="Você"
              />
            ) : (
              player.name
            )}
          </div>
          {size !== 'small' && withDescription && (
            <div className="avatar-card__description">{avatar.description[language]}</div>
          )}
        </>
      )}
      {children}
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
