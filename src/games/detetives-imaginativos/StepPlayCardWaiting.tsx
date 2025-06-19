// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { AvatarName } from 'components/avatars';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { StepTitle, RuleInstruction } from 'components/text';
// Internal
import type { CardEntry } from './utils/types';
import { Table } from './components/Table';
import { ImposterTitle, SecretClueTitle } from './components/Titles';
// Icons

type StepPlayCardWaitingProps = {
  isUserTheImpostor: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: PlayerId;
};

export function StepPlayCardWaiting({
  isUserTheImpostor,
  clue,
  currentPlayer,
  table,
  players,
  user,
  isLoading,
  turnOrder,
  leaderId,
}: StepPlayCardWaitingProps) {
  useTemporarilyHidePlayersBar();

  return (
    <>
      <StepTitle>{isUserTheImpostor ? <ImposterTitle /> : <SecretClueTitle clue={clue} />}</StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              Aguarde enquanto <AvatarName player={currentPlayer} addressUser /> escolhe uma carta.
            </>
          }
          en={
            <>
              Wait while <AvatarName player={currentPlayer} /> picks a card.
            </>
          }
        />
      </RuleInstruction>

      <Table table={table} players={players} />

      <TurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
        reorderByUser={leaderId}
      />

      <FloatingHand>
        <ImageCardHand hand={user.hand} disabledSelectButton={isLoading} sizeRatio={user.hand?.length} />
      </FloatingHand>
    </>
  );
}
