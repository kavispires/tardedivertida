// Design Resources
import { Alert } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { translate } from '..';

type PageErrorProps = {
  message?: string;
  description?: string;
};

export function PageError({ message, description }: PageErrorProps): JSX.Element {
  const language = useLanguage();

  return (
    <div className="container container--center">
      <Alert
        message={translate('Algo errado não está certo', 'Something wrong is not right', language, message)}
        description={translate(
          'Não era pra você estar vendo esta mensagem.',
          'You were not supposed to see this message.',
          language,
          description
        )}
        type="error"
        showIcon
      />
    </div>
  );
}
