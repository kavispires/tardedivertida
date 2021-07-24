import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import { Avatar } from './Avatar';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { translate } from '../shared/Translate';

export const AvatarEntry = memo(function ({ id, name, animate, className }) {
  const language = useLanguage();
  return (
    <div className={clsx('avatar-entry', animate && 'avatar-entry--floating', className)}>
      <Avatar id={id} className="avatar-entry__avatar" size="large" />
      <div className="avatar-entry__name">{name || translate('Fulano', 'John Doe', language)}</div>
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
};
