// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { Table } from './components/Table';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName, IconAvatar } from 'components/avatars';
import { ImageCardHand } from 'components/image-cards';
import { FloatingHand } from 'components/general/FloatingHand';
import { TurnOrder } from 'components/players';

type StepPlayCardWaitingProps = {
  isUserTheImpostor: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: DetetivesImaginativosCardEntry[];
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
      <Title>
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
      </Title>

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
