import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { BugOutlined } from '@ant-design/icons';
import { App, Button, Flex, Popconfirm, Space } from 'antd';
// Utils
import { isDevEnv } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
// Internal
import { ALL_SETTINGS } from '../utils/settings';
import { composeLocalPlayedKey, composeLocalTodayKey } from '../utils';

const keys = Object.values(ALL_SETTINGS);

type DevResetLocalStorageButtonProps = {
  localStorageKey?: string;
};

export function DevResetLocalStorageButton({ localStorageKey }: DevResetLocalStorageButtonProps) {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onReset = () => {
    if (localStorageKey) {
      localStorage.removeItem(composeLocalTodayKey(localStorageKey));
      localStorage.removeItem(composeLocalPlayedKey(localStorageKey));
    } else {
      keys.forEach((key) => {
        localStorage.removeItem(composeLocalTodayKey(key.KEY));
        localStorage.removeItem(composeLocalPlayedKey(key.KEY));
      });
    }
    message.success(<Translate pt="LS resetado corretamente" en="LS reset successfully" />);
    navigate('/diario');
  };

  const onDayBefore = () => {
    const yesterday = JSON.stringify({
      id: '2023-10-30',
      number: -1,
    });
    if (localStorageKey) {
      localStorage.setItem(composeLocalTodayKey(localStorageKey), yesterday);
      return;
    }
    keys.forEach((key) => {
      localStorage.setItem(composeLocalTodayKey(key.KEY), yesterday);
      localStorage.setItem(composeLocalPlayedKey(key.KEY), yesterday);
    });

    navigate('/diario');
  };

  const onLog = () => {
    if (localStorageKey) {
      const value = JSON.parse(localStorage.getItem(composeLocalTodayKey(localStorageKey)) ?? '{}');
      if (isDevEnv) {
        // biome-ignore lint/suspicious/noConsole: dev only
        console.log(value);
      } else {
        alert(JSON.stringify(value, null, 2));
      }
    }
  };

  return (
    <Flex justify="center" gap={12}>
      <Space.Compact>
        <Popconfirm
          title={
            <Translate
              pt="Tem certeza que quer resetar o jogo?"
              en="Are you sure you want to reset the game?"
            />
          }
          onConfirm={onReset}
        >
          <Button size="large" type="dashed" icon={<BugOutlined />}>
            <Translate pt="Resetar LS" en="Reset LS" />
          </Button>
        </Popconfirm>
        {isDevEnv && (
          <Button size="large" type="dashed" onClick={onDayBefore} icon={<BugOutlined />}>
            Yesterday LS
          </Button>
        )}
        <Button size="large" type="dashed" onClick={onLog}>
          Log
        </Button>
      </Space.Compact>
    </Flex>
  );
}
