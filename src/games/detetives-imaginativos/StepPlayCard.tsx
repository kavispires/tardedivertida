// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Step, type StepProps } from '@components/steps/Step';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { CardEntry, SubmitPlayCardPayload } from './utils/types';
import { StepPlayCardAction } from './StepPlayCardAction';
import { StepPlayCardWaiting } from './StepPlayCardWaiting';

type StepPlayCardProps = {
  isUserTheImpostor: boolean;
  isUserTheCurrentPlayer: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  onPlayCard: (payload: SubmitPlayCardPayload) => void;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: UID;
} & Pick<StepProps, 'announcement'>;

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
  return (
    <Step
      announcement={announcement}
      hidePlayersBar
    >
      <ViewIf condition={isUserTheCurrentPlayer}>
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
      </ViewIf>
      <ViewIf condition={!isUserTheCurrentPlayer}>
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
      </ViewIf>
    </Step>
  );
}
