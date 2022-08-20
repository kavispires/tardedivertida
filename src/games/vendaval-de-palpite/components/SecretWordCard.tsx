// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';

type SecretWordCardProps = {
  secretWord: string;
};

export function SecretWordCard({ secretWord }: SecretWordCardProps) {
  const { translate } = useLanguage();

  return (
    <Card header={translate('Palavra Secreta', 'Secret Word')} color="red">
      {secretWord}
    </Card>
  );
}
