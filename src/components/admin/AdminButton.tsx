import type { ReactNode } from 'react';
import { RocketFilled } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';

interface AdminButtonProps extends ButtonProps {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Action triggered when the button is clicked
   */
  onClick: GenericFunction;
}

export function AdminButton({ onClick, children, ...rest }: AdminButtonProps) {
  const { isLoading } = useLoading();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  if (!isAdminEnabled) return <span></span>;

  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={onClick} disabled={isLoading} {...rest}>
      {children}
    </Button>
  );
}
