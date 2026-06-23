// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TextCard } from '@components/cards/TextCard';

type EspiaoEntreNosCardProps = {
  location: string;
  role: string;
  header?: string;
};

export const EspiaoEntreNosCard = ({ location, role, header }: EspiaoEntreNosCardProps) => {
  const { translate } = useLanguage();

  const spyHeader = translate({ pt: 'Local Desconhecido', en: 'Unknown Location' });
  const spyFooter = translate({ pt: 'Você é o espião', en: 'You are the spy' });
  const agentFooter = translate({ pt: `Você é um(a) ${role}`, en: `You are a ${role}` });

  return (
    <TextCard
      color={location === 'SPY' ? 'red' : 'lime'}
      header={location === 'SPY' ? spyHeader : header}
      size="large"
      footer={role === 'SPY' ? spyFooter : agentFooter}
      className="e-card"
      classNames={{ footer: 'e-card__footer' }}
    >
      {location === 'SPY' ? <QuestionCircleFilled /> : location}
    </TextCard>
  );
};
