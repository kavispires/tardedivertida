import clsx from 'clsx';
// Ant Design Resources
import { Space, Typography } from 'antd';
// Components
import { AvatarIcon } from 'components/avatars';

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
