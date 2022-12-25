import { Space } from 'antd';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { ReactNode } from 'react';

export function WinningCount({ children }: { children: ReactNode }) {
  return (
    <Space className="space-container">
      <PlayersHighlight>{children}</PlayersHighlight>
    </Space>
  );
}
