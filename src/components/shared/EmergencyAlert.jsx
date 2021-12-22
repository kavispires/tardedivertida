import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from '../../utils/helpers';

export function EmergencyAlert({ children, duration = 2 }) {
  const [isVisible, setVisible] = useState(true);

  useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire: () => setVisible(false),
  });

  return (
    <Modal centered footer={null} visible={isVisible} className="emergency-alert" closable={false}>
      {children}
    </Modal>
  );
}

EmergencyAlert.propTypes = {
  children: PropTypes.any,
  duration: PropTypes.number,
};
