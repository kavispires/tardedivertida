// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards/Card';

type UeSoIssoCardProps = {
  word?: any;
  header?: any;
};

export function UeSoIssoCard({ word, header }: UeSoIssoCardProps) {
  const { translate } = useLanguage();

  return (
    <Card
      color="purple"
      header={translate('A Palavra Secreta é', 'Secret Word', header)}
      size="large"
    >
      {word ?? <WarningOutlined />}
    </Card>
  );
}
