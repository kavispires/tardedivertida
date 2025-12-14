import { Link } from 'react-router-dom';
// Ant Design Resources
import { Alert } from 'antd';
// Components
import { Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';

type PageErrorProps = {
  message?: string;
  description?: string;
};

export function PageError({ message, description }: PageErrorProps) {
  return (
    <PageLayout className="container container--center">
      <Alert
        title={
          <Translate pt="Algo errado não está certo" en="Something wrong is not right" custom={message} />
        }
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
    </PageLayout>
  );
}
