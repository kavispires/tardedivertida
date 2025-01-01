// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Instruction, TextHighlight, StepTitle } from 'components/text';
// Internal
import type { CardEntry } from './utils/types';
import { Table } from './components/Table';

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
      <StepTitle>
        {isUserTheImpostor ? (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" />{' '}
            <TextHighlight>
              <QuestionCircleFilled />
            </TextHighlight>{' '}
            <Translate pt="Você é o impostor!" en="You are the impostor!" />
          </>
        ) : (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" /> <TextHighlight>{clue}</TextHighlight>
          </>
        )}
      </StepTitle>

      <Instruction>
        <>
          <IconAvatar icon={<AnimatedClockIcon />} size="large" />{' '}
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
        </>
      </Instruction>

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
