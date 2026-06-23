// Ant Design Resources
import { Button } from 'antd';
// Components
import { Translate } from '@components/language/Translate';

type ResetButtonProps = {
  goToStep: (index: number) => void;
};

export function ResetButton({ goToStep }: ResetButtonProps) {
  return (
    <Button
      onClick={() => goToStep(1)}
      size="large"
    >
      <Translate
        pt="Reiniciar"
        en="Restart"
      />
    </Button>
  );
}
