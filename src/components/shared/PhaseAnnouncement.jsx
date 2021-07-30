import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resource
import { Button } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { TimedButton } from './index';
import { translate } from './Translate';
import { Title } from './Title';
import { Painting, Evaluate, Multitask, Picture, Seal } from '../icons';

const getIconType = (type) => {
  switch (type) {
    case 'painting':
      return Painting;
    case 'evaluate':
      return Evaluate;
    case 'picture':
      return Picture;
    case 'seal':
      return Seal;
    default:
      return Multitask;
  }
};

export function PhaseAnnouncement({
  buttonText,
  type,
  title,
  children,
  duration,
  currentRound,
  onClose,
  className,
  withoutTimer,
}) {
  const language = useLanguage();
  const durationPerRound = [15, 10, 7, 5]?.[currentRound] ?? 4;
  const Icon = getIconType(type);

  return (
    <div className={clsx('phase-announcement', className)}>
      <Title>{title}</Title>
      <Icon className="phase-announcement__icon" />

      {children}

      {withoutTimer ? (
        <Button type="primary" onClick={onClose}>
          {translate('Prosseguir', 'Continue', language, buttonText)}
        </Button>
      ) : (
        <TimedButton
          duration={duration || durationPerRound}
          type="text"
          label={translate('Prosseguir', 'Continue', language, buttonText)}
          onClick={onClose}
          onExpire={onClose}
        />
      )}
    </div>
  );
}

PhaseAnnouncement.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  currentRound: PropTypes.number,
  duration: PropTypes.number,
  onClose: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  withoutTimer: PropTypes.bool,
};

PhaseAnnouncement.defaultProps = {
  currentRound: 0,
  withoutTimer: false,
};
