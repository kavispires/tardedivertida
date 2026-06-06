import { useMemo } from 'react';
// Ant Design Resources
import { Input, Space, Typography } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Utils
import { getToday } from 'utils/helpers';
// Internal
import { ALL_SETTINGS } from './utils/settings';
import { DailyChrome } from './components/DailyChrome';
import { useDailyChallengeContext } from './hooks/useDailyChallengeContext';

const PRIORITY_LIST = Object.values(ALL_SETTINGS);

export function DebugPage() {
  const { isAdmin } = useCurrentUserContext();
  // Load challenge
  const challengeQuery = useDailyChallengeContext();
  const challengeData = challengeQuery.data as Record<string, unknown> | undefined;

  if (challengeQuery.isLoading) {
    return (
      <DailyChrome>
        <Typography.Text>Loading...</Typography.Text>
      </DailyChrome>
    );
  }

  if (!isAdmin) {
    return <Typography.Text>Unauthorized</Typography.Text>;
  }

  return (
    <DailyChrome>
      <Space
        orientation="vertical"
        className="margin"
      >
        <pre>Today: {getToday()}</pre>
        {PRIORITY_LIST.map((game) => (
          <Content
            key={game.KEY}
            localKey={game.KEY}
            data={challengeData?.[game.ROUTE]}
          />
        ))}
      </Space>
    </DailyChrome>
  );
}

function Content({ localKey, data = {} }: { localKey: string; data: any }) {
  const value = useMemo(
    () =>
      JSON.stringify(JSON.parse(localStorage.getItem(`TD_DAILY_${localKey}_LOCAL_TODAY`) || '{}'), null, 2),
    [localKey],
  );
  return (
    <Space orientation="vertical">
      <Typography.Paragraph
        className="center"
        strong
      >
        {localKey}
      </Typography.Paragraph>

      <div className="grid grid-2">
        <Input.TextArea
          cols={10}
          rows={8}
          value={value}
          style={{ width: 'clamp(300px, 90vw, 960px)' }}
        />
        <Input.TextArea
          cols={10}
          rows={8}
          value={JSON.stringify(data, null, 2)}
          style={{ width: 'clamp(300px, 90vw, 960px)' }}
        />
      </div>
    </Space>
  );
}
