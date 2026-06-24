import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { Step } from '@components/steps/Step';
import { Title } from '@components/text/Title';
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
  const { translate } = useLanguage();
  const [isAccusationSelectVisible, setAccusationSelectVisible] = useState(true);
  const { notification } = App.useApp();

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

  const hideAccusationSelect = () => {
    setAccusationSelectVisible(false);
  };

  return (
    <Step
      className="e-phase-step"
      hidePlayersBar
    >
      <div className="e-phase-step-header">
        <div className="e-phase-step-header__timer-container">
          <Timer
            timer={timer}
            hideAccusationSelect={hideAccusationSelect}
            setStep={setStep}
          />
        </div>

        <div className="e-phase-step-header__center">
          <Title
            level={2}
            className="e-phase-title"
          >
            {isUserTheSpy ? (
              <Translate
                pt="Onde eles estão?"
                en="Where are they?"
              />
            ) : (
              <Translate
                pt="Quem é o espião?"
                en="Who is the spy?"
              />
            )}
          </Title>

          <Card
            location={user.location}
            role={user.role}
          />
        </div>
      </div>

      {isAccusationSelectVisible && (
        <SpaceContainer>
          {isUserTheSpy && (
            <LocationSelect
              locations={locations}
              onSend={onGuessLocation}
            />
          )}
          |
          {!user?.usedAccusation ? (
            <PlayerSelect
              players={players}
              onSend={onMakeAccusation}
            />
          ) : (
            <Surface className="e-phase-instruction">
              <Translate
                pt="Você já usou sua chance de acusar"
                en="You already used your accusation"
              />
            </Surface>
          )}
        </SpaceContainer>
      )}

      <Surface className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Surface>

      <Notes />
    </Step>
  );
}
