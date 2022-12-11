import { ReactNode } from 'react';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { AdminButton, AdminOnlyContainer } from './index';

type AdminOnlyButtonProps = {
  /**
   * The click action
   */
  onClick: GenericFunction;
  /**
   * The button label
   */
  label: ReactNode;
};

export function AdminOnlyButton({ onClick, label }: AdminOnlyButtonProps) {
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  if (!isAdminEnabled) return <span></span>;

  return (
    <AdminOnlyContainer>
      <AdminButton onClick={onClick}>{label}</AdminButton>
    </AdminOnlyContainer>
  );
}
