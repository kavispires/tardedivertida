import clsx from 'clsx';
// Design Resources
import { Space, Typography } from 'antd';
import { AvatarIcon } from '..';

type LoadingProps = {
  message?: string;
  margin?: boolean;
};
export function Loading({ message, margin = false }: LoadingProps) {
  return (
    <Space className={clsx('loading', margin && 'loading--margin')}>
      <AvatarIcon type="animated-loader" style={{ display: 'block' }} />
      {Boolean(message) && <Typography.Text>{message}</Typography.Text>}
    </Space>
  );
}
