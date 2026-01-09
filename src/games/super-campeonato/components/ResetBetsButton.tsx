// Ant Design Resources
import { Button } from 'antd';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language';

type ResetBettingButtonProps = {
  onConfirm: () => void;
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
      type="yes-no"
    >
      <Button>
        <Translate
          pt="Reiniciar"
          en="Reset"
        />
      </Button>
    </Popconfirm>
  );
}
