// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TextCard } from '@components/cards/TextCard';

type SecretWordCardProps = {
  secretWord: string;
};

export function SecretWordCard({ secretWord }: SecretWordCardProps) {
  const { translate } = useLanguage();

  return (
    <TextCard
      header={translate({ pt: 'Palavra Secreta', en: 'Secret Word' })}
      color="red"
    >
      {secretWord}
    </TextCard>
  );
}
