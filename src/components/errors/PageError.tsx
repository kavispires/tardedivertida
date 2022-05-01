// Ant Design Resources
import { Alert } from 'antd';
import { Translate } from 'components/language';
// Hooks
import { useLanguage } from 'hooks';
import { Link } from 'react-router-dom';
// Components

type PageErrorProps = {
  message?: string;
  description?: string;
};

export function PageError({ message, description }: PageErrorProps): JSX.Element {
  const { translate } = useLanguage();

  return (
    <div className="container container--center">
      <Alert
        message={translate('Algo errado não está certo', 'Something wrong is not right', message)}
        description={
          <>
            <Translate
              pt="Não era pra você estar vendo esta mensagem."
              en="You were not supposed to see this message."
              custom={description}
            />
            <br />
            <Link to="/">
              <Translate pt="Ir para a página inicial" en="Go home" />
            </Link>
          </>
        }
        type="error"
        showIcon
      />
    </div>
  );
}
