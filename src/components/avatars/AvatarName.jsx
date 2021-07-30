import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Resources
import { AVATARS } from '../../utils/constants';
// Hooks
import { useGlobalState, useLanguage } from '../../hooks';
// Components
import { Avatar } from './Avatar';
import { translate } from '../shared';

export const AvatarName = memo(function ({
  player,
  size,
  className,
  withDescription,
  uppercase,
  addressUser,
}) {
  const [userId] = useGlobalState('userId');
  const language = useLanguage();

  const baseClass = 'avatar-name';

  const isUser = player.id === userId;
  const addressedUser = translate('VOCÊ', 'YOU', language);

  return (
    <span
      className={clsx(baseClass, `${baseClass}--${size}`, uppercase && `${baseClass}--uppercase`, className)}
    >
      <Avatar id={player.avatarId} className="avatar-name__avatar" size={size} />
      <span className="avatar-name__name">{addressUser && isUser ? addressedUser : player.name}</span>
      {withDescription && (
        <span className="avatar-name__name">, {AVATARS[player.avatarId].description[language]}</span>
      )}
    </span>
  );
});

AvatarName.propTypes = {
  addressUser: PropTypes.bool,
  className: PropTypes.string,
  player: PropTypes.shape({
    avatarId: PropTypes.string,
    id: PropTypes.any,
    name: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  uppercase: PropTypes.bool,
  withDescription: PropTypes.bool,
};

AvatarName.defaultProps = {
  addressUser: false,
  className: '',
  size: 'default',
  uppercase: false,
  withDescription: false,
};
