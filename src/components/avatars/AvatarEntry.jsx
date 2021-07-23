import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import { Avatar } from './Avatar';

export const AvatarEntry = memo(function ({ id, name, animate, className }) {
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar id={id} className="avatar-entry__avatar" />
      <div className="avatar-entry__name">{name}</div>
    </div>
  );
});

Avatar.propTypes = {
  animate: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

Avatar.defaultProps = {
  animate: false,
  className: '',
  id: '25',
  name: 'Fulano',
};
