import clsx from 'clsx';
// Ant Design Resources
import { Space, Typography } from 'antd';
// Components
import { AnimatedLoaderIcon } from 'components/icons/AnimatedLoaderIcon';
import { IconAvatar } from 'components/icons/IconAvatar';

type LoadingProps = {
  message?: string;
  margin?: boolean;
};
export function Loading({ message, margin = false }: LoadingProps) {
  return (
    <Space className={clsx('loading', margin && 'loading--margin')}>
      <IconAvatar icon={<AnimatedLoaderIcon />} style={{ display: 'block' }} />
      {Boolean(message) && <Typography.Text>{message}</Typography.Text>}
    </Space>
  );
}
