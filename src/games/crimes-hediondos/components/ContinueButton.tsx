// Ant Design Resources
import { Button, type ButtonProps } from 'antd';
// Components
import { Translate } from 'components/language';
// State

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
