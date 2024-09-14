// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step, type StepProps } from 'components/steps';
import { ViewOr } from 'components/views';
// Internal
import type { CardEntry } from './utils/types';
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
  onPlayCard: GenericFunction;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: PlayerId;
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
