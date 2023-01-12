import { ReactNode } from 'react';
// AntDesign Resources
import { Space } from 'antd';
// Components
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';

export function WinningCount({ children }: { children: ReactNode }) {
  return (
    <Space className="space-container">
      <PlayersHighlight>{children}</PlayersHighlight>
    </Space>
  );
}
