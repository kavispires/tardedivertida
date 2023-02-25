import clsx from 'clsx';
// Ant Design Resources
import { Space, Typography } from 'antd';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { IconAvatar } from 'components/avatars';

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
