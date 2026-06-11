// Ant Design Resources
import { Button, type ButtonProps } from 'antd';
// Components
import { Translate } from 'components/language/Translate';

interface ContinueButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: NonNullable<ButtonProps['onClick']>;
  disabled?: boolean;
  children?: string;
}

export function ContinueButton({ onClick, children, disabled = false, ...props }: ContinueButtonProps) {
  return (
    <Button
      type="primary"
      size="large"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children ?? (
        <>
          »»{' '}
          <Translate
            pt="Próximo"
            en="Next"
          />{' '}
          »»
        </>
      )}
    </Button>
  );
}
