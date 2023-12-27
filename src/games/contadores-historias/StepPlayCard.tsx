// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { TableFaceDown } from './components/TableFaceDown';
import { mockPlayCard } from './utils/mock';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Card } from 'components/cards';
import { ViewOr } from 'components/views';
import { Translate } from 'components/language';
import { ImageCardHand } from 'components/image-cards';
import { FloatingHand } from 'components/general/FloatingHand';

type StepPlayCardProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  storyteller: GamePlayer;
  isUserTheStoryTeller: boolean;
} & AnnouncementProps;

export function StepPlayCard({
  players,
  story,
  user,
  onPlayCard,
  storyteller,
  isUserTheStoryTeller,
  announcement,
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
  }, [user.hand]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Card header={storyteller.name} className="c-story-card" randomColor>
          {story}
        </Card>
      </Title>

      <RuleInstruction type={isUserTheStoryTeller ? 'wait' : 'action'}>
        <ViewOr condition={isUserTheStoryTeller}>
          <Translate
            pt="Agora, cada jogador escolherá uma carta em mão que mais combine com a história que você escreveu."
            en="Now every other player will play a card that best matches the story you wrote."
          />

          <Translate
            pt={
              <>
                Agora, escolha uma carta que mais combine com a história da rodada.
                <br />
                Você está tentando convencer os outros jogadores a escolherem sua carta ao invés da carta
                correta.
              </>
            }
            en={
              <>
                Now you select a card that matches the story the best.
                <br />
                You are trying to convince other players that your card is the correct one.
              </>
            }
          />
        </ViewOr>
      </RuleInstruction>

      <TableFaceDown players={players} user={user} />

      <FloatingHand>
        <ImageCardHand
          hand={user.hand}
          onSelectCard={hasPlayedCardAlready ? undefined : onSelectCard}
          disabledSelectButton={isLoading || hasPlayedCardAlready}
          sizeRatio={user.hand?.length}
        />
      </FloatingHand>
    </Step>
  );
}
