// Hooks
import { useLanguage } from '../../hooks';
// Components
import { AdminNextRoundButton, Instruction, Step, Title, translate, Translate } from '../../components';
import { EspiaoEntreNosCard as Card } from './Card';
import { LocationsList } from './LocationsList';
import { Notes } from './Notes';

type StepAssignmentProps = {
  user: GamePlayer;
  isUserTheSpy: boolean;
  locations: ELocation[];
};

export function StepAssignment({ user, isUserTheSpy, locations }: StepAssignmentProps) {
  const language = useLanguage();

  return (
    <Step className="e-phase-step">
      <Title level={2} className="e-phase-title">
        <Translate pt="Você está no(a)..." en="We are in/at/on..." />
      </Title>

      <Card location={user.location} role={user.role} />

      <AdminNextRoundButton buttonText={translate('Começar cronômetro', 'Start Timer', language)} />

      <Instruction className="e-phase-instruction">
        {isUserTheSpy ? (
          <Translate
            pt="Você terá 10 minutos para descobrir onde os outros agentes estão! Pronto?"
            en="You have 10 minutes to find out where the other agents are! Ready?"
          />
        ) : (
          <Translate
            pt="Você terá 10 minutos para descobrir quem é o espião entre nós! Pronto?"
            en="You have 10 minutes to find out who is the spy! Ready?"
          />
        )}
      </Instruction>

      <Instruction className="e-lists">
        <LocationsList locations={locations} />
      </Instruction>
      <Notes />
    </Step>
  );
}
