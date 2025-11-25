import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Internal
import type { Location, Outcome, TimerType } from './utils/types';
import { EspiaoEntreNosCard as Card } from './components/Card';
import { LocationSelect } from './components/LocationSelect';
import { LocationsList } from './components/LocationsList';
import { Notes } from './components/Notes';
import { PlayerSelect } from './components/PlayerSelect';
import { SuspectsList } from './components/SuspectsList';
import { Timer } from './components/Timer';

type StepInvestigationProps = {
  user: GamePlayer;
  isUserTheSpy: boolean;
  locations: Location[];
  players: GamePlayers;
  timer: TimerType;
  onGuessLocation: GenericFunction;
  onMakeAccusation: GenericFunction;
  onSendLastQuestioner: GenericFunction;
  outcome?: Outcome;
  setStep: UseStep['setStep'];
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
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();
  const [isAccusationSelectVisible, setAccusationSelectVisible] = useState(true);
  const { notification } = App.useApp();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this when the outcome type changes
  useEffect(() => {
    if (outcome?.type === 'VOTE_FAIL') {
      notification.info({
        title: translate('A votação não foi unânime', 'The voting was not unanimous'),
        description: outcome.votedYes ? `Votaram sim: ${outcome.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }
  }, [outcome?.type]);

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
        <SpaceContainer>
          {isUserTheSpy && <LocationSelect locations={locations} onSend={onGuessLocation} />}|
          {!user?.usedAccusation ? (
            <PlayerSelect players={players} onSend={onMakeAccusation} />
          ) : (
            <Instruction className="e-phase-instruction">
              <Translate pt="Você já usou sua chance de acusar" en="You already used your accusation" />
            </Instruction>
          )}
        </SpaceContainer>
      )}

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Instruction>

      <Notes />
    </Step>
  );
}
