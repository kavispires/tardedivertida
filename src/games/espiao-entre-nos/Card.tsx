// Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Card, translate } from '../../components';

type EspiaoEntreNosCardProps = {
  location: string;
  role: string;
  header?: string;
};

export const EspiaoEntreNosCard = ({ location, role, header }: EspiaoEntreNosCardProps) => {
  const language = useLanguage();

  const spyHeader = translate('Local Desconhecido', 'Unknown Location', language);
  const spyFooter = translate('Você é o espião', 'You are the spy', language);
  const agentFooter = translate(`Você é um(a) ${role}`, `You are a ${role}`, language);

  return (
    <Card
      color={location === 'SPY' ? 'red' : 'lime'}
      header={location === 'SPY' ? spyHeader : header}
      size="large"
      footer={role === 'SPY' ? spyFooter : agentFooter}
      className="e-card"
      footerClassName="e-card__footer"
    >
      {location === 'SPY' ? <QuestionCircleFilled /> : location}
    </Card>
  );
};
