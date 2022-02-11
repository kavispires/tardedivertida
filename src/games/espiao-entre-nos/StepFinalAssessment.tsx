import { Instruction, Step, Title, Translate } from '../../components';
import { FinalAssessmentInstruction } from './RulesBlobs';
import { EspiaoEntreNosCard as Card } from './Card';
import { LocationsList } from './LocationsList';
import { Notes } from './Notes';
import { SuspectsList } from './SuspectsList';
import { FinalAssessmentModal } from './FinalAssessmentModal';
import { useEffect } from 'react';
import { notification } from 'antd';
import { useLanguage } from '../../hooks';

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
