// Design Resources
import { WarningOutlined } from '@ant-design/icons';
import { getColorFromLetter } from '../../utils/helpers';
// Components
import { Card } from '../../components';

type ArteRuimCardProps = {
  text?: any;
  level: number;
  header?: string;
};

const ArteRuimCard = ({ text, level, header = 'X' }: ArteRuimCardProps) => {
  return (
    <Card
      color={getColorFromLetter(header)}
      header={header}
      size="medium"
      footer={Array(level).fill('•').join('')}
    >
      {text ?? <WarningOutlined />}
    </Card>
  );
};

export default ArteRuimCard;
