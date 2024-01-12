// Types
import type { GamePlayer } from 'types/player';
import type { CardEntry } from '../utils/types';
// Components
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';

type YourSelectedCardsProps = {
  table: CardEntry[];
  user: GamePlayer;
};

export function YourSelectedCards({ table, user }: YourSelectedCardsProps) {
  const userSelectedCards = table.find((entry) => entry.playerId === user.id)?.cards;

  return (
    <FloatingHand title={<Translate pt="Suas cartas selecionadas" en="Your selected cards" />}>
      <ImageCardHand hand={userSelectedCards ?? []} sizeRatio={6} />
    </FloatingHand>
  );
}
