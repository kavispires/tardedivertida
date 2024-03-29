// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Hooks
import { Card } from 'components/cards';
// Components
import { useLanguage } from 'hooks/useLanguage';

type UeSoIssoCardProps = {
  word?: any;
  header?: any;
};

export function UeSoIssoCard({ word, header }: UeSoIssoCardProps) {
  const { translate } = useLanguage();

  return (
    <Card color="purple" header={translate('A Palavra Secreta é', 'Secret Word', header)} size="large">
      {word ?? <WarningOutlined />}
    </Card>
  );
}
