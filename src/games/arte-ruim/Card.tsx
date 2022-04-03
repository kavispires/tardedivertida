// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Helpers
import { getColorFromLetter } from 'utils/helpers';
// Components
import { Card } from 'components/cards';

type ArteRuimCardProps = {
  text?: any;
  level: number;
  header?: string;
};

export const ArteRuimCard = ({ text, level, header = 'X' }: ArteRuimCardProps) => {
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
