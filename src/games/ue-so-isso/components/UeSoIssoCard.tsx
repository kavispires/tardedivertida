// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TextCard } from '@components/cards/TextCard';

type UeSoIssoCardProps = {
  word?: any;
  header?: any;
};

export function UeSoIssoCard({ word, header }: UeSoIssoCardProps) {
  const { translate } = useLanguage();

  return (
    <TextCard
      color="purple"
      header={translate({ pt: 'A Palavra Secreta é', en: 'Secret Word', custom: header })}
      size="large"
    >
      {word ?? <WarningOutlined />}
    </TextCard>
  );
}
