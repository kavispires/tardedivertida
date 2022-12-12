// Ant Design Resources
import { Button } from 'antd';
// Components
import { Translate } from 'components/language';

type ResetButtonProps = {
  goToStep: GenericFunction;
};

export function ResetButton({ goToStep }: ResetButtonProps) {
  return (
    <Button onClick={() => goToStep(1)} size="large">
      <Translate pt="Reiniciar" en="Restart" />
    </Button>
  );
}
