// Design Resources
import { Button, ButtonProps } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State
import { useLoading } from 'hooks';

interface AdminButtonProps extends ButtonProps {
  action: GenericFunction;
  label: string;
  [key: string]: any;
}

export function AdminButton({ action, label, ...props }: AdminButtonProps) {
  const { isLoading } = useLoading();

  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={action} disabled={isLoading} {...props}>
      {label}
    </Button>
  );
}
