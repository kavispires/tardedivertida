// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Components
import { useLanguage } from 'hooks';
import { Card } from 'components';

type UeSoIssoCardProps = {
  word?: any;
  header?: any;
};

function UeSoIssoCard({ word, header }: UeSoIssoCardProps) {
  const { translate } = useLanguage();

  return (
    <Card color="purple" header={translate('A Palavra Secreta é', 'Secret Word', header)} size="large">
      {word ?? <WarningOutlined />}
    </Card>
  );
}

export default UeSoIssoCard;
