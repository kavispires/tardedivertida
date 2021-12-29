// Components
import { AdminOnlyContainer, AdminButton } from './index';

type AdminOnlyButtonProps = {
  action: GenericFunction;
  label: string;
};

export function AdminOnlyButton({ action, label }: AdminOnlyButtonProps) {
  return (
    <AdminOnlyContainer>
      <AdminButton action={action} label={label} />
    </AdminOnlyContainer>
  );
}
