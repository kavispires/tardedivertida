// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step } from 'components/steps';
import { ViewOr } from 'components/views';
import { StepDefendingAction } from './StepDefendingAction';
import { StepDefendingWaiting } from './StepDefendingWaiting';

type StepDefendingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  isUserTheCurrentPlayer: boolean;
  table: DetetivesImaginativosCardEntry[];
  onFinishDefenseClick: GenericFunction;
  isLoading: boolean;
  isUserTheImpostor: boolean;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: TurnOrder;
} & AnnouncementProps;

export function StepDefending({
  clue,
  currentPlayer,
  isUserTheCurrentPlayer,
  table,
  onFinishDefenseClick,
  isLoading,
  isUserTheImpostor,
  user,
  players,
  turnOrder,
  announcement,
}: StepDefendingProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step announcement={announcement}>
      <ViewOr condition={isUserTheCurrentPlayer}>
        <StepDefendingAction
          clue={clue}
          currentPlayer={currentPlayer}
          table={table}
          onFinishDefenseClick={onFinishDefenseClick}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          user={user}
          players={players}
          turnOrder={turnOrder}
        />

        <StepDefendingWaiting
          clue={clue}
          currentPlayer={currentPlayer}
          table={table}
          isUserTheImpostor={isUserTheImpostor}
          user={user}
          players={players}
          turnOrder={turnOrder}
        />
      </ViewOr>
    </Step>
  );
}
