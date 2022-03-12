// Components
import { AdminOnlyContainer, AdminButton } from './index';

type AdminOnlyButtonProps = {
  onClick: GenericFunction;
  label: ReactChildren;
};

export function AdminOnlyButton({ onClick, label }: AdminOnlyButtonProps) {
  return (
    <AdminOnlyContainer>
      <AdminButton onClick={onClick}>{label}</AdminButton>
    </AdminOnlyContainer>
  );
}
