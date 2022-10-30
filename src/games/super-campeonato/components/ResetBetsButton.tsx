// Ant Design Resources
import { Button, Popconfirm } from 'antd';
// Components
import { Translate } from 'components/language';

type ResetBettingButtonProps = {
  onConfirm: GenericFunction;
};

export function ResetBetsButton({ onConfirm }: ResetBettingButtonProps) {
  return (
    <Popconfirm
      title={
        <Translate
          pt="Tem certeza que quer reiniciar apostas?"
          en="Are you sure you want to restart the bets?"
        />
      }
      onConfirm={onConfirm}
      okText={<Translate pt="Sim" en="Yes" />}
      cancelText={<Translate pt="Não" en="No" />}
    >
      <Button>
        <Translate pt="Reiniciar" en="Reset" />
      </Button>
    </Popconfirm>
  );
}
