import { Space } from 'antd';
import { Card } from 'components/cards';
import { useLanguage } from 'hooks';

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
