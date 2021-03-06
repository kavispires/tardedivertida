// Hooks
import { useLoading, useMock } from 'hooks';
// Components
import { TableFaceDown } from './components/TableFaceDown';
import { mockPlayCard } from './utils/mock';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Card, FloatingHand, ImageCardHand } from 'components/cards';
import { ViewOr } from 'components/views';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';

type StepPlayCardProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  storyteller: GamePlayer;
  isUserTheStoryTeller: boolean;
};

export function StepPlayCard({
  players,
  story,
  user,
  onPlayCard,
  storyteller,
  isUserTheStoryTeller,
}: StepPlayCardProps) {
  const { isLoading } = useLoading();
  const hasPlayedCardAlready = Boolean(user.cardId);

  const onSelectCard = (cardId: string) => {
    onPlayCard({
      cardId,
    });
  };

  useMock(() => {
    if (!isUserTheStoryTeller) {
      onPlayCard(mockPlayCard(user.hand));
    }
  }, []);

  return (
    <Step fullWidth>
      <Title>
        <Card header={storyteller.name} className="c-story-card" randomColor>
          {story}
        </Card>
      </Title>

      <Instruction contained>
        <ViewOr orCondition={isUserTheStoryTeller}>
          <Translate
            pt="Agora, cada jogador escolherá uma carta em mão que mais combine com a história que você escreveu."
            en="Now every other player will play a card that best matches the story you wrote."
          />

          <Translate
            pt="Agora, escolha uma carta que mais combine com a história da rodada. Você está tentando convencer os outros jogadores a escolherem sua carta ao invés da carta correta."
            en="Now you select a card that matches the story the best. You are trying to convince other players that your card is the correct one."
          />
        </ViewOr>
      </Instruction>

      <TableFaceDown players={players} user={user} />

      <ReadyPlayersBar players={players} />

      <FloatingHand>
        <ImageCardHand
          hand={user.hand}
          onSelectCard={hasPlayedCardAlready ? undefined : onSelectCard}
          disabledSelectButton={isLoading || hasPlayedCardAlready}
          sizeRatio={user.hand.length}
        />
      </FloatingHand>
    </Step>
  );
}
