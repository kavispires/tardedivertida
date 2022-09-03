import { useEffect } from 'react';
// Ant Design Resources
import { notification } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { FinalAssessmentInstruction } from './components/RulesBlobs';
import { EspiaoEntreNosCard as Card } from './components/Card';
import { LocationsList } from './components/LocationsList';
import { Notes } from './components/Notes';
import { SuspectsList } from './components/SuspectsList';
import { FinalAssessmentModal } from './components/FinalAssessmentModal';

type StepFinalAssessmentProps = {
  onMakeAccusation: GenericFunction;
  players: GamePlayers;
  user: GamePlayer;
  locations: ELocation[];
  isUserTheAccuser: boolean;
  outcome?: EOutcome;
  finalAssessment: FinalAssessment;
};

export function StepFinalAssessment({
  finalAssessment,
  players,
  user,
  locations,
  isUserTheAccuser,
  onMakeAccusation,
  outcome,
}: StepFinalAssessmentProps) {
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();

  useEffect(() => {
    if (outcome?.type === 'VOTE_FAIL') {
      notification.info({
        message: translate('A votação não foi unânime', 'The voting was not unanimous'),
        description: outcome.votedYes ? `Votaram sim: ${outcome.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }
  }, [outcome?.type]); // eslint-disable-line

  return (
    <Step>
      <Title level={2} className="e-phase-title">
        <Translate pt="Última Chance!" en="Last chance!" />
      </Title>

      <FinalAssessmentModal
        isModalVisible={isUserTheAccuser}
        onMakeAccusation={onMakeAccusation}
        players={players}
        finalAssessment={finalAssessment}
      />

      <FinalAssessmentInstruction finalAssessment={finalAssessment} players={players} />

      <Card location={user.location} role={user.role} />

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Instruction>

      <Notes />
    </Step>
  );
}
