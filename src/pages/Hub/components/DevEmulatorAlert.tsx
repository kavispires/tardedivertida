import { useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Modal } from 'antd';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useGlobalState } from 'hooks/useGlobalState';

/**
 * The emulator only properly works if using the local ip, to allow multi device testing
 * including mobile, this component will display an alert in case the current port is localhost
 */
export function DevEmulatorAlert() {
  const { isDevEnv } = useDevFeatures();
  const [stay, setStay] = useState(false);
  const [usingFirestoreEmulator] = useGlobalState('usingFirestoreEmulator');
  const [usingFunctionsEmulator] = useGlobalState('usingFunctionsEmulator');

  const ip = import.meta.env.VITE__LOCAL_IP;
  const displayDevWarningMessage = isDevEnv && window.location.hostname !== usingFirestoreEmulator;
  const displayDevWarningMessageFunctions = isDevEnv && window.location.hostname !== usingFunctionsEmulator;
  const { port, pathname, hash, protocol } = window.location;
  const newPath = `${ip}:${port}${pathname}/${hash}`.replace('//', '/');
  const emulatorUrl = `${protocol}//${newPath}`;

  useEffectOnce(() => {
    if (!stay && isDevEnv && displayDevWarningMessage) {
      Modal.confirm({
        title: 'Wrong Dev Environment',
        icon: <ExclamationCircleOutlined />,
        content: 'You are in a development environment and not using the Firestore emulator.',
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
              You are in a development environment and not using the Firestore emulator.{' '}
              <Button href={emulatorUrl} type="link">
                Switch Routes
              </Button>
            </>
          }
          type="error"
          showIcon
          banner
        />
      )}
      {displayDevWarningMessageFunctions && (
        <Alert
          message={
            <>
              You are in a development environment and not using the Functions emulator.{' '}
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
      {!displayDevWarningMessageFunctions && !displayDevWarningMessage && (
        <Alert message={<>You are running emulators safely.</>} type="success" showIcon banner />
      )}
    </>
  );
}
