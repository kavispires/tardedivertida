import { RocketFilled } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { useGlobalState, useLoading } from 'hooks';

interface AdminButtonProps extends ButtonProps {
  onClick: GenericFunction;
  children: ReactChildren;
}

export function AdminButton({ onClick, children, ...props }: AdminButtonProps) {
  const { isLoading } = useLoading();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  if (!isAdminEnabled) return <span></span>;

  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={onClick} disabled={isLoading} {...props}>
      {children}
    </Button>
  );
}
