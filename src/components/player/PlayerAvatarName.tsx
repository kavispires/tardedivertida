import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { AVATARS } from 'utils/avatars';
// Internal
import { PlayerAvatar } from './PlayerAvatar';
// Sass
import styles from './PlayerAvatarName.module.scss';

export type PlayerAvatarNameProps = {
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
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * Displays a player's avatar with their name, with options for styling and user identification
 */
export const PlayerAvatarName = ({
  player,
  size = 'small',
  className = '',
  withDescription = false,
  uppercase = false,
  addressUser = false,
  upright = false,
  ...rest
}: PlayerAvatarNameProps) => {
  const [userId] = useGlobalState('userId');
  const { language, translate } = useLanguage();

  const isUser = player.id === userId;
  const addressedUser = translate('VOCÊ', 'YOU');

  return (
    <span
      {...rest}
      className={clsx(styles.avatarName, uppercase && styles.uppercase, upright && styles.upright, className)}
    >
      <PlayerAvatar
        avatarId={player.avatarId}
        className={styles.avatar}
        size={size}
      />
      <span className={styles.name}>{addressUser && isUser ? addressedUser : player.name}</span>
      {withDescription && (
        <span className={styles.name}>, {AVATARS[player.avatarId].description[language]}</span>
      )}
    </span>
  );
};

/**
 * Displays an NPC/bot player avatar with name, styled for non-player characters
 */
export const NPCPlayerAvatarName = ({
  size = 'small',
  className = '',
  withDescription = false,
  uppercase = false,
  botId,
  botName = 'Bot',
  upright = false,
  ...rest
}: Omit<PlayerAvatarNameProps, 'player'> & { botId: string; botName?: string }) => {
  const { language } = useLanguage();

  return (
    <span
      {...rest}
      className={clsx(styles.avatarName, uppercase && styles.uppercase, upright && styles.upright, className)}
    >
      <PlayerAvatar
        avatarId={botId}
        className={styles.avatar}
        size={size}
      />
      <span className={styles.name}>{botName}</span>
      {withDescription && <span className={styles.name}>, {AVATARS[botId].description[language]}</span>}
    </span>
  );
};
