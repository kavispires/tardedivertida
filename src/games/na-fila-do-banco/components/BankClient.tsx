// Components
import { ImageCard } from 'components/image-cards';
// Internal
import type { ClientCard } from '../utils/types';

type BankClientProps = {
  cardId: string;
  deckDict: Dictionary<ClientCard>;
  cardWidth: number;
};

export function BankClient({ cardId, deckDict, cardWidth }: BankClientProps) {
  return (
    <ImageCard
      cardId={deckDict[cardId].imageId}
      cardWidth={cardWidth}
    />
  );
}
