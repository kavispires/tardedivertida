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
import * as IconIllustrations from '../icons';

const getIconType = (type) => {
  switch (type) {
    case 'crime-scene':
      return IconIllustrations.CrimeScene;
    case 'criminal':
      return IconIllustrations.Criminal;
    case 'defense':
      return IconIllustrations.Defense;
    case 'eye':
      return IconIllustrations.Eye;
    case 'evaluate':
      return IconIllustrations.Evaluate;
    case 'gears':
      return IconIllustrations.Gears;
    case 'guess':
      return IconIllustrations.Guess;
    case 'hanging-photograph':
      return IconIllustrations.HangingPhotograph;
    case 'investigation':
      return IconIllustrations.Investigation;
    case 'law':
      return IconIllustrations.Law;
    case 'newspaper':
      return IconIllustrations.Newspaper;
    case 'opinions':
      return IconIllustrations.Opinions;
    case 'painting':
      return IconIllustrations.Painting;
    case 'picture':
      return IconIllustrations.Picture;
    case 'rank':
      return IconIllustrations.Rank;
    case 'seal':
      return IconIllustrations.Seal;
    case 'secret':
      return IconIllustrations.Secret;
    case 'verify-list':
      return IconIllustrations.VerifyList;
    case 'vote':
      return IconIllustrations.Vote;
    case 'witness':
      return IconIllustrations.Witness;
    case 'writing':
      return IconIllustrations.Writing;
    default:
      return IconIllustrations.Multitask;
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
  unskippable,
}) {
  const language = useLanguage();
  const durationPerRound = [15, 15, 10, 5, 4]?.[currentRound] ?? 4;
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
          disabled={unskippable}
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
  unskippable: PropTypes.bool,
  withoutTimer: PropTypes.bool,
};

PhaseAnnouncement.defaultProps = {
  currentRound: 0,
  withoutTimer: false,
};
