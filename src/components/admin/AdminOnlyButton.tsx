// Components
import { AdminOnly, AdminButton } from './index';

type AdminOnlyButtonProps = {
  action: GenericFunction;
  label: string;
};

export function AdminOnlyButton({ action, label }: AdminOnlyButtonProps) {
  return (
    <AdminOnly>
      <AdminButton action={action} label={label} />
    </AdminOnly>
  );
}
