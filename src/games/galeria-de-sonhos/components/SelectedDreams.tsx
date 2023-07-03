// Components
import { ImageCardHand } from 'components/cards';

type SelectedDreamsProps = {
  user: GamePlayer;
};

export function SelectedDreams({ user }: SelectedDreamsProps) {
  if (!user.cards) {
    return <></>;
  }

  const cards = Object.values<PlainObject>(user.cards ?? {}).map((card) => card.cardId);

  return <ImageCardHand hand={cards} sizeRatio={16} />;
}
