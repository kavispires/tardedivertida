import type { ReactNode } from 'react';
// Internal
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
  return (
    <AdminOnlyContainer>
      <AdminButton onClick={onClick}>{label}</AdminButton>
    </AdminOnlyContainer>
  );
}
