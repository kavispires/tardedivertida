import { useMemo } from 'react';
// Ant Design Resources
import { Input, Space, Typography } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { ALL_SETTINGS } from '../utils/settings';
import { DailyChrome } from '../components/DailyChrome';
import { getToday } from '../utils';

const PRIORITY_LIST = Object.values(ALL_SETTINGS);

export function DebugPage() {
  const { isAdmin } = useCurrentUserContext();

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
          />
        ))}
      </Space>
    </DailyChrome>
  );
}

function Content({ localKey }: { localKey: string }) {
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

      <Input.TextArea
        cols={10}
        rows={8}
        value={value}
        style={{ width: 'clamp(300px, 80vw, 960px)' }}
      />
    </Space>
  );
}
