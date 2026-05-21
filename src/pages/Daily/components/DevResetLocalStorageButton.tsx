import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { BugOutlined } from '@ant-design/icons';
import { App, Button, Flex, Space } from 'antd';
// Utils
import { getToday, isDevEnv } from 'utils/helpers';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language/Translate';
// Internal
import { ALL_SETTINGS } from '../utils/settings';
import { resetStreak } from '../utils/streakManager';
import { composeLocalPlayedKey, composeLocalTodayKey } from '../utils';

const keys = Object.values(ALL_SETTINGS);
const STREAK_KEY = 'TD_DAILY_STREAK';

type DevResetLocalStorageButtonProps = {
  localStorageKey?: string;
};

export function DevResetLocalStorageButton({ localStorageKey }: DevResetLocalStorageButtonProps) {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onReset = () => {
    if (localStorageKey) {
      // Reset specific game
      localStorage.removeItem(composeLocalTodayKey(localStorageKey));
      localStorage.removeItem(composeLocalPlayedKey(localStorageKey));

      // Also remove from streak history for today
      try {
        const today = getToday();
        const streak = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
        if (streak.history?.[today]) {
          streak.history[today] = streak.history[today].filter((key: string) => key !== localStorageKey);
          localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: error logging
        console.error('Failed to remove from streak history:', error);
      }
    } else {
      // Reset all games
      keys.forEach((key) => {
        localStorage.removeItem(composeLocalTodayKey(key.KEY));
        localStorage.removeItem(composeLocalPlayedKey(key.KEY));
      });

      // Reset streak
      resetStreak();
    }
    message.success(
      <Translate
        pt="LS resetado corretamente"
        en="LS reset successfully"
      />,
    );
    navigate('/diario');
  };

  const onResetStreakOnly = () => {
    resetStreak();
    message.success(
      <Translate
        pt="Streak resetada"
        en="Streak reset"
      />,
    );
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
    } else {
      // Log streak data
      const streak = JSON.parse(localStorage.getItem(STREAK_KEY) ?? '{}');

      // Log all game keys
      const allGameData: PlainObject = {};
      keys.forEach((key) => {
        const todayData = localStorage.getItem(composeLocalTodayKey(key.KEY));
        const playedData = localStorage.getItem(composeLocalPlayedKey(key.KEY));
        if (todayData || playedData) {
          allGameData[key.KEY] = {
            today: todayData ? JSON.parse(todayData) : null,
            played: playedData ? JSON.parse(playedData) : null,
          };
        }
      });

      if (isDevEnv) {
        // biome-ignore lint/suspicious/noConsole: dev only
        console.log('All Game Data:', allGameData);
        // biome-ignore lint/suspicious/noConsole: dev only
        console.log('Streak Data:', streak);
      } else {
        alert(`Games: ${JSON.stringify(allGameData, null, 2)}\n\nStreak: ${JSON.stringify(streak, null, 2)}`);
      }
    }
  };

  return (
    <Flex
      justify="center"
      gap={12}
    >
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
          <Button
            size="small"
            type="dashed"
            icon={<BugOutlined />}
          >
            <Translate
              pt="Resetar LS"
              en="Reset LS"
            />
          </Button>
        </Popconfirm>
        {isDevEnv && (
          <>
            <Button
              size="small"
              type="dashed"
              onClick={onDayBefore}
              icon={<BugOutlined />}
            >
              Yesterday LS
            </Button>
            <Button
              size="small"
              type="dashed"
              onClick={onResetStreakOnly}
              icon={<BugOutlined />}
            >
              Reset Streak
            </Button>
          </>
        )}
        <Button
          size="small"
          type="dashed"
          onClick={onLog}
        >
          Log
        </Button>
      </Space.Compact>
    </Flex>
  );
}
