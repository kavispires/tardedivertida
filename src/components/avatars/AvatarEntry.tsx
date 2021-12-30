import clsx from 'clsx';
// Components
import { Avatar } from './Avatar';
// Utils
import { Translate } from '../shared';

type AvatarEntryProps = {
  id?: string;
  name?: string;
  animate?: boolean;
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
