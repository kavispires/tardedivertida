// Ant Design Resources
import { Button, ButtonProps } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State
import { useLoading } from 'hooks';

interface AdminButtonProps extends ButtonProps {
  onClick: GenericFunction;
  children: ReactChildren;
}

export function AdminButton({ onClick, children, ...props }: AdminButtonProps) {
  const { isLoading } = useLoading();

  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={onClick} disabled={isLoading} {...props}>
      {children}
    </Button>
  );
}
