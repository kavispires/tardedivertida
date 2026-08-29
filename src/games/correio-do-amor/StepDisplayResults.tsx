// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Icons
import { BlackmailIcon } from '@icons/BlackmailIcon';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { OngoingEffect, LogEntry, FestaJuninaCard } from './utils/types';
import { PLAYER_STATUS } from './utils/constants';
import { Summary } from './components/Summary';
import { PlayArea } from './components/PlayArea';
import { DeckExplanation } from './components/DeckExplanation';
import { NonPlayingUserArea, EliminatedUserArea } from './components/UserAreas';
import { CardResolutionAnimation } from './components/CardResolutionAnimation';

type StepDisplayResultsProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  turnOrder: GameOrder;
  gameOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  activePlayer: GamePlayer;
  deck: UID[];
  ongoingEffects: OngoingEffect[];
  log: LogEntry[];
};

export function StepDisplayResults({
  cardsDict,
  user,
  deck,
  turnOrder,
  gameOrder,
  activePlayer,
  players,
  cardsSetAside,
  discardPile,
  ongoingEffects,
  log,
}: StepDisplayResultsProps) {
  const latestLogEntry = log[0];
  const playedCard = cardsDict?.[latestLogEntry?.cardKey ?? ''] ?? null;

  const announcement = latestLogEntry?.eliminatedPlayersIds.includes(user.id) ? (
    <PhaseAnnouncement
      icon={<BlackmailIcon />}
      title={
        <Translate
          pt="Você está eliminado!"
          en="You are eliminated!"
        />
      }
      // currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  ) : undefined;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {playedCard.flavorText ?? (
          <Translate
            pt="E o que aconteceu..."
            en="What had happened was..."
          />
        )}
      </StepTitle>

      <Summary
        user={user}
        ongoingEffects={ongoingEffects}
        players={players}
        deck={deck}
        turnOrder={turnOrder}
        activePlayerId={activePlayer.id}
        discardPile={discardPile}
        cardsSetAside={cardsSetAside}
      />

      <PlayArea
        players={players}
        gameOrder={gameOrder}
        activePlayerId={activePlayer.id}
        user={user}
        userArea={
          <>
            {user.hand && user.status !== PLAYER_STATUS.ELIMINATED && (
              <NonPlayingUserArea
                cardsDict={cardsDict}
                user={user}
              />
            )}

            {user.status === PLAYER_STATUS.ELIMINATED && <EliminatedUserArea />}
          </>
        }
      >
        <CardResolutionAnimation
          players={players}
          activePlayer={activePlayer}
          cardsDict={cardsDict}
          logEntry={latestLogEntry}
        />
      </PlayArea>

      <HostNextPhaseButton
        autoTriggerTime={45}
        withWaitingTimeBar
      />

      <DeckExplanation cardsDict={cardsDict} />
    </Step>
  );
}
