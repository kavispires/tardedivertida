import { FireFilled } from '@ant-design/icons';
import { Space, SpaceProps } from 'antd';
import clsx from 'clsx';
import { useGlobalState } from 'hooks';

interface AdminOnlyContainerProps extends SpaceProps {
  children: any;
  className?: string;
}

export const AdminOnlyContainer = ({ children, className = '', ...props }: AdminOnlyContainerProps) => {
  const [isAdmin] = useGlobalState('isAdmin');
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
