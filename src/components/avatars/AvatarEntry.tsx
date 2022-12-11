import clsx from 'clsx';
// Components
import { Translate } from 'components/language';
import { Avatar } from './Avatar';
// Sass
import './AvatarEntry.scss';

type AvatarEntryProps = {
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
};

export const AvatarEntry = ({ player, animate = false, className = '' }: AvatarEntryProps) => {
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar id={player?.avatarId} className="avatar-entry__avatar" size="large" />
      <div className="avatar-entry__name">
        <Translate pt="Fulano" en="John Doe" custom={player?.name} />
      </div>
    </div>
  );
};
