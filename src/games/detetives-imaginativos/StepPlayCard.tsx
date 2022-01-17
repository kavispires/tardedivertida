// Design Resources
import { Avatar } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
// Components
import {
  AvatarName,
  FloatingHand,
  Icons,
  ImageCardHand,
  Instruction,
  Step,
  Title,
  TitleHighlight,
  Translate,
  ViewIf,
} from '../../components';
import Table from './Table';

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
};

function StepPlayCard({
  isUserTheImpostor,
  isUserTheCurrentPlayer,
  clue,
  currentPlayer,
  table,
  players,
  user,
  onPlayCard,
  isLoading,
}: StepPlayCardProps) {
  const onSelectCard = (cardId: string) => onPlayCard({ cardId });

  return (
    <Step key={1}>
      <Title>
        {isUserTheImpostor ? (
          <>
            <QuestionCircleFilled />{' '}
            <Translate
              pt="Pista? Que pista? Você é o impostor!"
              en="Clue? What clue? You are the impostor!"
            />
          </>
        ) : (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" />{' '}
            <TitleHighlight>{clue}</TitleHighlight>
          </>
        )}
      </Title>
      <Instruction>
        <ViewIf isVisible={isUserTheCurrentPlayer && !isUserTheImpostor}>
          <>
            <Avatar src={<Icons.ImageCards />} size="small" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com a pista secreta."
              en="Select a card that best fits the secret clue."
            />
          </>
        </ViewIf>
        <ViewIf isVisible={isUserTheCurrentPlayer && isUserTheImpostor}>
          <>
            <Avatar src={<Icons.ImageCards />} size="small" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com as cartas que os outros
                jogadores estão usando."
              en="Select a card that best fits with what others are playing."
            />
          </>
        </ViewIf>
        <ViewIf isVisible={!isUserTheCurrentPlayer}>
          <>
            <Avatar src={<Icons.AnimatedClock />} size="small" />{' '}
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
        </ViewIf>
      </Instruction>
      <Table table={table} players={players} />
      <FloatingHand>
        <ImageCardHand
          hand={user.hand}
          onSelectCard={isUserTheCurrentPlayer ? onSelectCard : undefined}
          disabledSelectButton={isLoading}
          sizeRatio={6}
        />
      </FloatingHand>
    </Step>
  );
}

export default StepPlayCard;
