// Ant Design Resources
import { Space } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';
// Ant Design resources

type ChallengeProps = {
  challenge: TextCard;
};

export function Challenge({ challenge }: ChallengeProps) {
  const { translate } = useLanguage();
  return (
    <Space className="space-container" align="center">
      <Card header={translate('Desafio', 'Challenge')} color="purple">
        {challenge.text}
      </Card>
    </Space>
  );
}
