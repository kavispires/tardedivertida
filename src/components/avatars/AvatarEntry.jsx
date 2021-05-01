import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import Avatar from './Avatar';

function AvatarEntry({ id = 25, name = 'Fulano', animate = false, className = '' }) {
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar id={id} className="avatar-entry__avatar" />
      <div className="avatar-entry__name">{name}</div>
    </div>
  );
}

Avatar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  animate: PropTypes.boolean,
  className: PropTypes.string,
};

export default memo(AvatarEntry);
