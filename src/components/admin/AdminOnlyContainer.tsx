import clsx from 'clsx';
import type { ReactNode } from 'react';
import { FireFilled } from '@ant-design/icons';
import { Space, type SpaceProps } from 'antd';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGlobalState } from 'hooks/useGlobalState';
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
