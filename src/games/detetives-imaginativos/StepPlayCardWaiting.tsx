// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useTemporarilyHidePlayersBar } from '@hooks/useTemporarilyHidePlayersBar';
// Components
import { ImageCardHand } from '@components/image-cards/ImageCardHand';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { CardEntry } from './utils/types';
import { Table } from './components/Table';
import { ImposterTitle, SecretClueTitle } from './components/Titles';

type StepPlayCardWaitingProps = {
  isUserTheImpostor: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: UID;
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
          pt="Aguarde enquanto {player} escolhe uma carta."
          en="Wait while {player} picks a card."
          values={{
            player: (
              <PlayerAvatarName
                player={currentPlayer}
                addressUser
              />
            ),
          }}
        />
      </RuleInstruction>

      <Table
        table={table}
        players={players}
      />

      <PlayersTurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
        reorderByUser={leaderId}
      />

      <ImageCardHand
        hand={user.hand}
        disabledSelectButton={isLoading}
        sizeRatio={user.hand?.length}
      />
    </>
  );
}
