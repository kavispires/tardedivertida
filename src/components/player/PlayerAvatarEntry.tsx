import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import { PlayerAvatar } from './PlayerAvatar';
// Sass
import styles from './PlayerAvatarEntry.module.scss';

type PlayerAvatarEntryProps = {
  /**
   * A player instance
   */
  player: GamePlayer;
  /**
   * Add float animation
   */
  animate?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const PlayerAvatarEntry = ({
  player,
  animate = false,
  className = '',
  ...rest
}: PlayerAvatarEntryProps) => {
  return (
    <div
      className={clsx(styles.avatarEntry, animate && styles.floating, className)}
      {...rest}
    >
      <PlayerAvatar
        avatarId={player?.avatarId}
        className={styles.avatar}
        size="large"
      />

      <div className={styles.name}>
        <Translate
          pt="Fulano"
          en="John Doe"
          custom={player?.name}
        />
      </div>
    </div>
  );
};
