import type { ComponentProps, ReactNode } from 'react';
// Internal
import { AdminButton } from './AdminButton';
import { AdminOnlyContainer } from './AdminOnlyContainer';

type AdminOnlyButtonProps = {
  /**
   * The click action
   */
  onClick: ComponentProps<typeof AdminButton>['onClick'];
  /**
   * The button label
   */
  label: ReactNode;
};

/**
 * Convenience component combining AdminOnlyContainer and AdminButton for admin-only actions
 */
export function AdminOnlyButton({ onClick, label }: AdminOnlyButtonProps) {
  return (
    <AdminOnlyContainer>
      <AdminButton onClick={onClick}>{label}</AdminButton>
    </AdminOnlyContainer>
  );
}
