import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import { PlayerAvatar } from './PlayerAvatar';
// Sass
import './PlayerAvatarEntry.scss';

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
      className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}
      {...rest}
    >
      <PlayerAvatar
        avatarId={player?.avatarId}
        className="avatar-entry__avatar"
        size="large"
      />

      <div className="avatar-entry__name">
        <Translate
          pt="Fulano"
          en="John Doe"
          custom={player?.name}
        />
      </div>
    </div>
  );
};
