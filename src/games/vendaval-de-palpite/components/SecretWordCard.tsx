// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Card } from '@components/cards/Card';

type SecretWordCardProps = {
  secretWord: string;
};

export function SecretWordCard({ secretWord }: SecretWordCardProps) {
  const { translate } = useLanguage();

  return (
    <Card
      header={translate({ pt: 'Palavra Secreta', en: 'Secret Word' })}
      color="red"
    >
      {secretWord}
    </Card>
  );
}
