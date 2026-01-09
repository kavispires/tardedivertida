// Types
import type { GamePlayer } from 'types/player';
// Components
import { ImageCardHand } from 'components/image-cards';

type SelectedDreamsProps = {
  user: GamePlayer;
};

export function SelectedDreams({ user }: SelectedDreamsProps) {
  if (!user.cards) {
    return null;
  }

  const cards = Object.values<PlainObject>(user.cards ?? {}).map((card) => card.cardId);

  return (
    <ImageCardHand
      hand={cards}
      sizeRatio={16}
    />
  );
}
