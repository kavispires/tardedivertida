// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step, type StepProps } from 'components/steps';
import { ViewIf } from 'components/views';
// Internal
import type { CardEntry, SubmitDefensePayload } from './utils/types';
import { StepDefendingAction } from './StepDefendingAction';
import { StepDefendingWaiting } from './StepDefendingWaiting';

type StepDefendingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  isUserTheCurrentPlayer: boolean;
  table: CardEntry[];
  onFinishDefenseClick: (payload: SubmitDefensePayload) => void;
  isLoading: boolean;
  isUserTheImpostor: boolean;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: TurnOrder;
} & Pick<StepProps, 'announcement'>;

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
      <ViewIf condition={isUserTheCurrentPlayer}>
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
      </ViewIf>
      <ViewIf condition={!isUserTheCurrentPlayer}>
        <StepDefendingWaiting
          clue={clue}
          currentPlayer={currentPlayer}
          table={table}
          isUserTheImpostor={isUserTheImpostor}
          user={user}
          players={players}
          turnOrder={turnOrder}
        />
      </ViewIf>
    </Step>
  );
}
