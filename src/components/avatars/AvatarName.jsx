import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Resources
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';
// Components
import { Avatar } from './Avatar';
import { useGlobalState } from '../../hooks';

export const AvatarName = memo(function ({
  player,
  size = 'default',
  className = '',
  withDescription = false,
  uppercase = false,
  addressUser = false,
}) {
  const [username] = useGlobalState('username');

  const baseClass = 'avatar-name';

  const isUser = player.name === username;

  return (
    <span
      className={clsx(baseClass, `${baseClass}--${size}`, uppercase && `${baseClass}--uppercase`, className)}
    >
      <Avatar id={player.avatarId} className="avatar-name__avatar" size={size} />
      <span className="avatar-name__name">{addressUser && isUser ? 'VOCÊ' : player.name}</span>
      {withDescription && (
        <span className="avatar-name__name">, {AVATAR_DESCRIPTIONS_BR[player.avatarId]}</span>
      )}
    </span>
  );
});

AvatarName.propTypes = {
  player: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  withDescription: PropTypes.bool,
  uppercase: PropTypes.bool,
  addressUser: PropTypes.bool,
  className: PropTypes.string,
};
