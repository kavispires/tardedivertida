import { Alert, Button, Space } from 'antd';
import { useLanguage } from 'hooks/useLanguage';

import { DailyChrome } from './DailyChrome';
import { Translate } from 'components/language';
import { useNavigate } from 'react-router-dom';

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
              <span>Você pode estar na língua errada. Clique no botão para ser redirecionado:</span>
              <span>You might be in the wrong language. Click the button to be redirected:</span>
              <Button type="primary" onClick={onRedirect}>
                Redirecionar/Redirect
              </Button>
            </Space>
          }
          type="error"
          showIcon
        />
      </Space>
    </DailyChrome>
  );
}
