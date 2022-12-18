import { CheckCircleFilled } from '@ant-design/icons';
import clsx from 'clsx';
import { Avatar } from 'components/avatars';
import { ReactNode } from 'react';

type SocialProfileProps = {
  avatarId: string;
  name: ReactNode;
  handle: ReactNode;
  verified?: boolean;
  className?: string;
};

export function SocialProfile({ avatarId, name, handle, verified, className }: SocialProfileProps) {
  return (
    <div className={clsx('profile', className)}>
      <Avatar id={avatarId} size="large" className="profile__avatar" />
      <span className="profile__name">
        {name} {verified && <CheckCircleFilled style={{ color: 'dodgerBlue' }} />}
      </span>
      <span className="profile__handle">{handle}</span>
    </div>
  );
}
