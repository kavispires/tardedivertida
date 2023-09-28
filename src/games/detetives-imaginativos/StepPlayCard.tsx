// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step } from 'components/steps';
import { ViewOr } from 'components/views';
import { StepPlayCardAction } from './StepPlayCardAction';
import { StepPlayCardWaiting } from './StepPlayCardWaiting';

type StepPlayCardProps = {
  isUserTheImpostor: boolean;
  isUserTheCurrentPlayer: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: DetetivesImaginativosCardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: PlayerId;
} & AnnouncementProps;

export function StepPlayCard({
  isUserTheImpostor,
  clue,
  currentPlayer,
  table,
  players,
  user,
  onPlayCard,
  isLoading,
  turnOrder,
  leaderId,
  announcement,
  isUserTheCurrentPlayer,
}: StepPlayCardProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step announcement={announcement}>
      <ViewOr condition={isUserTheCurrentPlayer}>
        <StepPlayCardAction
          clue={clue}
          currentPlayer={currentPlayer}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          onPlayCard={onPlayCard}
          players={players}
          table={table}
          user={user}
          turnOrder={turnOrder}
          leaderId={leaderId}
        />

        <StepPlayCardWaiting
          clue={clue}
          currentPlayer={currentPlayer}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          players={players}
          table={table}
          user={user}
          turnOrder={turnOrder}
          leaderId={leaderId}
        />
      </ViewOr>
    </Step>
  );
}
