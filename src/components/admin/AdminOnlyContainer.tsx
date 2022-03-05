import clsx from 'clsx';
// Design Resources
import { Space } from 'antd';
// State
import { useGlobalState } from 'hooks';

type AdminOnlyContainerProps = {
  children: any;
  className?: string;
};

export const AdminOnlyContainer = ({ children, className = '' }: AdminOnlyContainerProps) => {
  const [isAdmin] = useGlobalState('isAdmin');

  if (!isAdmin) return <span></span>;

  return <Space className={clsx('admin-only-container', className)}>{children}</Space>;
};
