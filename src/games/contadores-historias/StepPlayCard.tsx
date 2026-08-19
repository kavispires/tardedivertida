// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { ImageCardHand } from '@components/image-cards/ImageCardHand';
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { mockPlayCard } from './utils/mock';
import type { PlayCardPayload } from './utils/types';
import { TableFaceDown } from './components/TableFaceDown';
import { StorytellingCard } from './components/StorytellingCard';

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
        <StorytellingCard
          storyteller={storyteller}
          story={story}
        />
      </StepTitle>

      <RuleInstruction type={isUserTheStoryTeller ? 'wait' : 'action'}>
        <ViewIf condition={isUserTheStoryTeller}>
          <Translate
            pt="Agora, cada jogador escolherá uma carta em mão que mais combine com a história que você escreveu."
            en="Now every other player will play a card that best matches the story you wrote."
          />
        </ViewIf>
        <ViewIf condition={!isUserTheStoryTeller}>
          <Translate
            pt="Agora, escolha uma carta que mais combine com a história da rodada.<br/>Você está tentando convencer os outros jogadores a escolherem sua carta ao invés da carta correta."
            en="Now you select a card that matches the story the best.<br/>You are trying to convince other players that your card is the correct one."
          />
        </ViewIf>
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
