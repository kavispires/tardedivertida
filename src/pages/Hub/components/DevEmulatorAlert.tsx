import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Modal } from 'antd';
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';

/**
 * The emulator only properly works if using the local ip, to allow multi device testing
 * including mobile, this component will display an alert in case the current port is localhost
 */
export function DevEmulatorAlert() {
  const { isDevEnv } = useDevFeatures();
  const [stay, setStay] = useState(false);

  const ip = process.env.REACT_APP_LOCAL_IP;
  const displayDevWarningMessage = isDevEnv && window.location.hostname !== ip;
  const { port, pathname, hash, protocol } = window.location;
  const newPath = `${ip}:${port}${pathname}/${hash}`.replace('//', '/');
  const emulatorUrl = `${protocol}//${newPath}`;

  useEffectOnce(() => {
    if (!stay && isDevEnv && displayDevWarningMessage) {
      Modal.confirm({
        title: 'Wrong Dev Environment',
        icon: <ExclamationCircleOutlined />,
        content: 'You are in a development environment and not using the emulator.',
        okText: 'Switch Routes',
        cancelText: 'Stay in Localhost',
        onOk: () => {
          setStay(true);
          window.location.href = emulatorUrl;
        },
      });
    }
  });

  if (!isDevEnv) return <></>;

  return (
    <>
      {displayDevWarningMessage && (
        <Alert
          message={
            <>
              You are in a development environment and not using the emulator.{' '}
              <Button href={emulatorUrl} type="link">
                Switch Routes
              </Button>
            </>
          }
          type="warning"
          showIcon
          banner
        />
      )}
    </>
  );
}
