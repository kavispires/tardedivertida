import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { RocketOutlined } from '@ant-design/icons';
import { Space, type SpaceProps } from 'antd';
// Hooks
import { useHost } from 'hooks/useHost';
// Sass
import styles from './HostOnlyContainer.module.scss';

interface HostOnlyContainerProps extends SpaceProps {
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
}

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
