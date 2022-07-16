import { useGlobalState } from 'hooks';
import { ReactNode } from 'react';
import { AdminButton, AdminOnlyContainer } from './index';

type AdminOnlyButtonProps = {
  onClick: GenericFunction;
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
