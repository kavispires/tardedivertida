import { Card } from 'components/cards';
import { useLanguage } from 'hooks';
import { pluralize } from 'utils/helpers';

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
