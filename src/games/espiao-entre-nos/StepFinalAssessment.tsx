import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { FinalAssessment, Location, Outcome } from './utils/types';
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
  locations: Location[];
  isUserTheAccuser: boolean;
  outcome?: Outcome;
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
  const { notification } = App.useApp();
  const { translate } = useLanguage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this when the outcome type changes
  useEffect(() => {
    if (outcome?.type === 'VOTE_FAIL') {
      notification.info({
        title: translate({ pt: 'A votação não foi unânime', en: 'The voting was not unanimous' }),
        description: outcome.votedYes ? `Votaram sim: ${outcome.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }
  }, [outcome?.type]);

  return (
    <Step hidePlayersBar>
      <StepTitle className="e-phase-title">
        <Translate
          pt="Última Chance!"
          en="Last chance!"
        />
      </StepTitle>

      <FinalAssessmentModal
        isModalVisible={isUserTheAccuser}
        onMakeAccusation={onMakeAccusation}
        players={players}
        finalAssessment={finalAssessment}
      />

      <FinalAssessmentInstruction
        finalAssessment={finalAssessment}
        players={players}
      />

      <Card
        location={user.location}
        role={user.role}
      />

      <Surface className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Surface>

      <Notes />
    </Step>
  );
}
