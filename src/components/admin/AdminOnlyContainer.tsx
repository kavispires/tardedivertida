import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { FireFilled } from '@ant-design/icons';
import { Space, type SpaceProps } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGlobalState } from 'hooks/useGlobalState';
// Sass
import styles from './AdminOnlyContainer.module.scss';

type AdminOnlyContainerProps = SpaceProps & {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
};

/**
 * Container that renders its children only for admin users when admin features are enabled
 */
export const AdminOnlyContainer = ({ children, className = '', ...props }: AdminOnlyContainerProps) => {
  const { isAdmin } = useCurrentUserContext();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  if (!isAdmin || !isAdminEnabled) return <span></span>;

  return (
    <fieldset className={clsx(styles.adminOnlyContainer, className)}>
      <legend className={styles.legend}>
        <FireFilled /> Admin Controls
      </legend>
      <Space {...props}>{children}</Space>
    </fieldset>
  );
};
