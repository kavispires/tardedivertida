// Ant Design Resources
import { Button, Popconfirm } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';

type ResetBettingButtonProps = {
  onConfirm: GenericFunction;
};

export function ResetBetsButton({ onConfirm }: ResetBettingButtonProps) {
  const { translate } = useLanguage();
  return (
    <Popconfirm
      title={translate(
        'Tem certeza que quer reiniciar apostas?',
        'Are you sure you want to restart the bets?'
      )}
      onConfirm={onConfirm}
      okText={translate('Sim', 'Yes')}
      cancelText={translate('Não', 'No')}
    >
      <Button>
        <Translate pt="Reiniciar" en="Reset" />
      </Button>
    </Popconfirm>
  );
}
