import React from 'react';
import clsx from 'clsx';
// Design Resources
import { Avatar } from 'antd';
// Images
import avatars from '../images/avatars.svg';

function AvatarEntry({ id = 0, name = 'Fulano', animate = false, className = '' }) {
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar
        className="avatar-entry__avatar"
        size="large"
        src={
          <svg viewBox="0 0 100 100">
            <use href={avatars + `#avatar-${id}`}></use>
          </svg>
        }
      />
      <div className="avatar-entry__name">{name}</div>
    </div>
  );
}

export default AvatarEntry;
