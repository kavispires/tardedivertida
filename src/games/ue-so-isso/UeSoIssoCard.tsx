// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Components
import { useLanguage } from '../../hooks';
import { Card, translate } from '../../components';

type UeSoIssoCardProps = {
  word?: any;
  header?: any;
};

function UeSoIssoCard({ word, header }: UeSoIssoCardProps) {
  const language = useLanguage();

  return (
    <Card
      color="purple"
      header={translate('A Palavra Secreta é', 'Secret Word', language, header)}
      size="large"
    >
      {word ?? <WarningOutlined />}
    </Card>
  );
}

export default UeSoIssoCard;
