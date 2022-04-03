// Components
import { notification, Space } from 'antd';
import { useEffect, useState } from 'react';
// Components
import { Instruction, Step, Title, Translate } from 'components';
import { useLanguage } from 'hooks';
import { EspiaoEntreNosCard as Card } from './Card';
import { LocationSelect } from './LocationSelect';
import { LocationsList } from './LocationsList';
import { Notes } from './Notes';
import { PlayerSelect } from './PlayerSelect';
import { SuspectsList } from './SuspectsList';
import { Timer } from './Timer';

type StepInvestigationProps = {
  user: GamePlayer;
  isUserTheSpy: boolean;
  locations: ELocation[];
  players: GamePlayers;
  timer: Timer;
  onGuessLocation: GenericFunction;
  onMakeAccusation: GenericFunction;
  onSendLastQuestioner: GenericFunction;
  outcome?: EOutcome;
  setStep: GenericFunction;
};

export function StepInvestigation({
  user,
  isUserTheSpy,
  locations,
  players,
  timer,
  onGuessLocation,
  onMakeAccusation,
  onSendLastQuestioner,
  outcome,
  setStep,
}: StepInvestigationProps) {
  const { translate } = useLanguage();
  const [isAccusationSelectVisible, setAccusationSelectVisible] = useState(true);

  useEffect(() => {
    if (outcome?.type === 'VOTE_FAIL') {
      notification.info({
        message: translate('A votação não foi unânime', 'The voting was not unanimous'),
        description: outcome.votedYes ? `Votaram sim: ${outcome.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }
  }, [outcome?.type]); // eslint-disable-line

  const hideAccusationSelect = () => {
    setAccusationSelectVisible(false);
  };

  return (
    <Step className="e-phase-step">
      <div className="e-phase-step-header">
        <div className="e-phase-step-header__timer-container">
          <Timer timer={timer} hideAccusationSelect={hideAccusationSelect} setStep={setStep} />
        </div>

        <div className="e-phase-step-header__center">
          <Title level={2} className="e-phase-title">
            {isUserTheSpy ? (
              <Translate pt="Onde eles estão?" en="Where are they?" />
            ) : (
              <Translate pt="Quem é o espião?" en="Who is the spy?" />
            )}
          </Title>

          <Card location={user.location} role={user.role} />
        </div>
      </div>

      {isAccusationSelectVisible && (
        <Space className="space-container" align="center">
          {isUserTheSpy && <LocationSelect locations={locations} onSend={onGuessLocation} />}|
          {!user?.usedAccusation ? (
            <PlayerSelect players={players} onSend={onMakeAccusation} />
          ) : (
            <Instruction className="e-phase-instruction">
              <Translate pt="Você já usou sua chance de acusar" en="You already used your accusation" />
            </Instruction>
          )}
        </Space>
      )}

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Instruction>

      <Notes />
    </Step>
  );
}
