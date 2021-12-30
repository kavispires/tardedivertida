import { useState } from 'react';
import { Modal } from 'antd';
import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from '../../utils/helpers';

type EmergencyAlertProps = {
  children: any;
  duration?: number;
};
export function EmergencyAlert({ children, duration = 2 }: EmergencyAlertProps) {
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
