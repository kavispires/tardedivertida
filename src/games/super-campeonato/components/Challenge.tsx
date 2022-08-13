// Ant Design resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { Card } from 'components/cards';

type ChallengeProps = {
  challenge: DefaultTextCard;
};

export function Challenge({ challenge }: ChallengeProps) {
  const { translate } = useLanguage();
  return (
    <Space className="space-container" align="center">
      <Card header={translate('Desafio', 'Challenge')} randomColor>
        {challenge.text}
      </Card>
    </Space>
  );
}
