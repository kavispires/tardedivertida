// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { mockPlayCard } from './utils/mock';
import type { PlayCardPayload } from './utils/types';
import { TableFaceDown } from './components/TableFaceDown';

type StepPlayCardProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onPlayCard: (payload: PlayCardPayload) => void;
  storyteller: GamePlayer;
  isUserTheStoryTeller: boolean;
} & Pick<StepProps, 'announcement'>;

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Card
          header={storyteller.name}
          className="c-story-card"
          randomColor
        >
          {story}
        </Card>
      </StepTitle>

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

      <TableFaceDown
        players={players}
        user={user}
      />

      <ImageCardHand
        hand={user.hand}
        onSelectCard={hasPlayedCardAlready ? undefined : onSelectCard}
        disabledSelectButton={isLoading || hasPlayedCardAlready}
        sizeRatio={user.hand?.length}
      />
    </Step>
  );
}
