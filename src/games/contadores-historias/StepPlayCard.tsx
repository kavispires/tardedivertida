// Hooks
import { useLoading } from '../../hooks';
// Components
import {
  Card,
  FloatingHand,
  ImageCardHand as Hand,
  Instruction,
  ReadyPlayersBar,
  Title,
  Translate,
  ViewIf,
} from '../../components';
import TableFaceDown from './TableFaceDown';

type StepPlayCardProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  storyteller: GamePlayer;
  isUserTheStoryTeller: boolean;
};

function StepPlayCard({
  players,
  story,
  user,
  onPlayCard,
  storyteller,
  isUserTheStoryTeller,
}: StepPlayCardProps) {
  const [isLoading] = useLoading();
  const hasPlayedCardAlready = Boolean(user.cardId);

  const onSelectCard = (cardId: string) => {
    onPlayCard({
      action: 'PLAY_CARD',
      cardId,
    });
  };

  return (
    <div className="c-step-play-card">
      <Title>
        <Card header={storyteller.name} className="c-story-card" randomColor>
          {story}
        </Card>
      </Title>
      <ViewIf isVisible={isUserTheStoryTeller}>
        <Instruction contained>
          <Translate
            pt="Agora, cada jogador escolherá uma carta em mão que mais combine com a história que você escreveu."
            en="Now every other player will play a card that best matches the story you wrote."
          />
        </Instruction>
      </ViewIf>
      <ViewIf isVisible={!isUserTheStoryTeller}>
        <Instruction contained>
          <Translate
            pt="Agora, escolha uma carta que mais combine com a história da rodada. Você está tentando convencer os outros jogadores a escolherem sua carta ao invés da carta correta."
            en="Now you select a card that matches the story the best. You are trying to convince other players that your card is the correct one."
          />
        </Instruction>
      </ViewIf>
      <TableFaceDown players={players} user={user} />
      <ReadyPlayersBar players={players} />
      <FloatingHand>
        <Hand
          hand={user.hand}
          onSelectCard={hasPlayedCardAlready ? undefined : onSelectCard}
          disabledSelectButton={isLoading || hasPlayedCardAlready}
          sizeRatio={user.hand.length}
        />
      </FloatingHand>
    </div>
  );
}

export default StepPlayCard;
