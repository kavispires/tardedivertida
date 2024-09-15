import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Alert, Button, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
// Internal
import { DailyChrome } from './DailyChrome';

export function DailyError() {
  const { toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();

  const onRedirect = () => {
    toggleLanguage();
    navigate(language === 'en' ? '/diario' : '/daily');
  };
  return (
    <DailyChrome>
      <Space className="container container--center">
        <Alert
          message={
            <Translate pt="O servidor decidiu não cooperar" en="The server decided not to cooperate" />
          }
          description={
            <Space direction="vertical">
              <Typography.Paragraph>
                <Translate
                  en="It's likely that the administrator forgot to generate new challenges for today. If you know them, please complain immediately. Bullying is the way."
                  pt="Provavelmente o administrador esqueceu de gerar novos desafios para hoje. Se você os conhece, reclame imediatamente. O bullying é o caminho."
                />
                <br />
                <Translate
                  en="It is also possible that you are in the wrong URL. Press here to go back to the right page."
                  pt="Também é possível que você esteja na URL errada. Pressione aqui para voltar para a página correta."
                />
                <Button type="link" onClick={onRedirect}>
                  Redirecionar/Redirect
                </Button>
              </Typography.Paragraph>
            </Space>
          }
          type="error"
          showIcon
        />
      </Space>
    </DailyChrome>
  );
}
