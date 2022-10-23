import { FloatingHand, ImageCardHand } from 'components/cards';
import { Translate } from 'components/language';

type YourSelectedCardsProps = {
  table: DetetivesImaginativosCardEntry[];

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
