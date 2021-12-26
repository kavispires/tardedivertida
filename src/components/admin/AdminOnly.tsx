import clsx from 'clsx';
// Design Resources
import { Space } from 'antd';
// State
import { useGlobalState } from '../../hooks';

type AdminOnlyProps = {
  children: any;
  className?: string;
};

export const AdminOnly = ({ children, className = '' }: AdminOnlyProps) => {
  const [isAdmin] = useGlobalState('isAdmin');

  if (!isAdmin) return <span></span>;

  return <Space className={clsx('admin-only-container', className)}>{children}</Space>;
};
