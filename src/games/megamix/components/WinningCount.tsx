// Ant Design Resources
import { Space } from 'antd';
// Components
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
// AntDesign Resources

type WinningCountProps = {
  winners: number;
  total: number;
};

export function WinningCount({ winners, total }: WinningCountProps) {
  return (
    <Space className="space-container">
      <PlayersHighlight>{winners}</PlayersHighlight> <span>vs</span>{' '}
      <PlayersHighlight className="grayscale">{total - winners}</PlayersHighlight>
    </Space>
  );
}
