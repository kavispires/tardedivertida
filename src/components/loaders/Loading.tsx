import clsx from 'clsx';
// Design Resources
import { Space, Spin, Typography } from 'antd';

type LoadingProps = {
  message?: string;
  margin?: boolean;
};
export function Loading({ message, margin = false }: LoadingProps) {
  return (
    <Space className={clsx('loading', margin && 'loading--margin')}>
      <Spin />
      {Boolean(message) && <Typography.Text>{message}</Typography.Text>}
    </Space>
  );
}
