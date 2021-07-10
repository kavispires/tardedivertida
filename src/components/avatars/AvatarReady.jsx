import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import { Avatar } from './Avatar';
import { CrownFilled, LikeFilled } from '@ant-design/icons';

export const AvatarReady = memo(function ({
  id = 25,
  name = 'Fulano',
  score = 0,
  ready = false,
  className = '',
}) {
  return (
    <div className={clsx('avatar-entry', className)}>
      <Avatar id={id} className="avatar-entry__avatar" />
      <div className="avatar-entry__name">{name}</div>
      <LikeFilled />
      <CrownFilled />
    </div>
  );
});

Avatar.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  score: PropTypes.number,
  ready: PropTypes.bool,
  animate: PropTypes.bool,
  className: PropTypes.string,
};
