import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
// Hook and Utils
import { useTimer } from 'react-timer-hook';
import { inNSeconds } from '../../utils/helpers';

export function TimedButton({ duration, label, onExpire, showTimer, ...props }) {
  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire: showTimer ? onExpire : undefined,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button {...props}>
      {label}{' '}
      {showTimer && (
        <span className={clsx(timeClass, `${timeClass}--${props.type}`)}>{minutes * 60 + seconds}</span>
      )}
    </Button>
  );
}

TimedButton.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.any.isRequired,
  onExpire: PropTypes.func.isRequired,
  showTimer: PropTypes.bool,
};

TimedButton.defaultProps = {
  duration: 10,
  showTimer: true,
};
