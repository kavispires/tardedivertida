import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Space, SpaceProps } from 'antd';
import { FireFilled } from '@ant-design/icons';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useCurrentUserContext } from 'services/AuthProvider';
// Sass
import './AdminOnlyContainer.scss';

interface AdminOnlyContainerProps extends SpaceProps {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
}

export const AdminOnlyContainer = ({ children, className = '', ...props }: AdminOnlyContainerProps) => {
  const { isAdmin } = useCurrentUserContext();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  if (!isAdmin || !isAdminEnabled) return <span></span>;

  return (
    <fieldset className={clsx('admin-only-container', className)}>
      <legend className="admin-only-container__legend">
        <FireFilled /> Admin Controls
      </legend>
      <Space {...props}>{children}</Space>
    </fieldset>
  );
};
