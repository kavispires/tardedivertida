// Ant Design Resources
import { Button, ButtonProps } from 'antd';
// State
import { Translate } from 'components';

interface ContinueButtonProps extends ButtonProps {
  onClick: GenericFunction;
  disabled?: boolean;
  children?: string;
}

export function ContinueButton({ onClick, children, disabled = false, ...props }: ContinueButtonProps) {
  return (
    <Button type="primary" size="large" disabled={disabled} onClick={onClick} {...props}>
      {children ?? (
        <>
          »» <Translate pt="Próximo" en="Next" /> »»
        </>
      )}
    </Button>
  );
}
