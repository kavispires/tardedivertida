import clsx from 'clsx';
// Components
import { Translate } from 'components/language';
import { Avatar } from './Avatar';

type AvatarEntryProps = {
  id?: string;
  name?: string;
  animate?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
};

export const AvatarEntry = ({ id, name, animate = false, className = '' }: AvatarEntryProps) => {
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar id={id} className="avatar-entry__avatar" size="large" />
      <div className="avatar-entry__name">
        <Translate pt="Fulano" en="John Doe" custom={name} />
      </div>
    </div>
  );
};
