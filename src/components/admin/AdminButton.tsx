import type { ReactNode } from 'react';
// Ant Design Resources
import { RocketFilled } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useCurrentUserContext } from '@hooks/useCurrentUserContext';
import { useGlobalState } from '@hooks/useGlobalState';
import { useLoading } from '@hooks/useLoading';

type AdminButtonProps = ButtonProps & {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Action triggered when the button is clicked
   */
  onClick: React.MouseEventHandler<HTMLElement>;
};

/**
 * Admin-only button that displays only when admin features are enabled and the user is an admin
 */
export function AdminButton({ onClick, children, ...rest }: AdminButtonProps) {
  const { isLoading } = useLoading();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const { isAdmin } = useCurrentUserContext();

  if (!isAdmin || !isAdminEnabled) return <span></span>;

  return (
    <Button
      icon={<RocketFilled />}
      danger
      type="primary"
      onClick={onClick}
      disabled={isLoading}
      {...rest}
    >
      {children}
    </Button>
  );
}
