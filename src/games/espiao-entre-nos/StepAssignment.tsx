// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Types
import type { Location } from './utils/types';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { EspiaoEntreNosCard as Card } from './components/Card';
import { LocationsList } from './components/LocationsList';
import { Notes } from './components/Notes';

type StepAssignmentProps = {
  user: GamePlayer;
  isUserTheSpy: boolean;
  locations: Location[];
};

export function StepAssignment({ user, isUserTheSpy, locations }: StepAssignmentProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step className="e-phase-step">
      <Title level={2} className="e-phase-title">
        <Translate pt="Você está no(a)..." en="We are in/at/on..." />
      </Title>

      <Card location={user.location} role={user.role} />

      <HostNextPhaseButton>
        <Translate pt="Começar cronômetro" en="Start Timer" />
      </HostNextPhaseButton>

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
