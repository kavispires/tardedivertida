import clsx from 'clsx';
// Ant Design Resources
import { Space, Typography } from 'antd';
// Icons
import { AnimatedLoaderIcon } from '@icons/AnimatedLoaderIcon';
// Components
import { Icon } from '@components/general/Icon';
// Sass
import styles from './loaders.module.scss';

type LoadingProps = {
  /**
   * Optional loading message to display
   */
  message?: string;
  /**
   * Whether to add margin around the loading component
   */
  margin?: boolean;
};

/**
 * Loading spinner with optional message and margin
 */
export function Loading({ message, margin = false }: LoadingProps) {
  return (
    <Space className={clsx(styles.loading, margin && styles['loading--margin'])}>
      <Icon
        icon={<AnimatedLoaderIcon />}
        style={{ display: 'block' }}
      />
      {Boolean(message) && <Typography.Text>{message}</Typography.Text>}
    </Space>
  );
}
