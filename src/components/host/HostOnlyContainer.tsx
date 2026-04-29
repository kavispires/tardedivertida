import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { RocketOutlined } from '@ant-design/icons';
import { Space, type SpaceProps } from 'antd';
// Hooks
import { useHost } from 'hooks/useHost';
// Sass
import styles from './HostOnlyContainer.module.scss';

export { styles as hostOnlyContainerStyles };

type HostOnlyContainerProps = SpaceProps & {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Custom label
   */
  label?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
};

/**
 * Container that renders its children only for the host player with a distinctive fieldset border
 */
export const HostOnlyContainer = ({ children, label, className = '', ...rest }: HostOnlyContainerProps) => {
  const isHost = useHost();

  if (!isHost) return null;

  return (
    <fieldset className={clsx(styles.hostOnlyContainer, className)}>
      <legend className={styles.legend}>
        <RocketOutlined /> {label ?? 'Host Controls'}
      </legend>
      <Space {...rest}>{children}</Space>
    </fieldset>
  );
};
