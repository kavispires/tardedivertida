import { Alert, Button } from 'antd';
import { useDevFeatures } from 'hooks';

/**
 * The emulator only properly works if using the local ip, to allow multi device testing
 * including mobile, this component will display an alert in case the current port is localhost
 */
export function DevEmulatorAlert() {
  const { isDevEnv } = useDevFeatures();

  if (!isDevEnv) return <></>;

  const ip = process.env.REACT_APP_LOCAL_IP;
  const displayDevWarningMessage = isDevEnv && window.location.hostname !== ip;
  const { port, pathname, hash, protocol } = window.location;
  const newPath = `${ip}:${port}${pathname}/${hash}`.replace('//', '/');
  const emulatorUrl = `${protocol}//${newPath}`;

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
