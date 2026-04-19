// Components
import { ImageCard } from 'components/image-cards/ImageCard';
// Internal
import type { ClientCard } from '../utils/types';

type BankClientProps = {
  cardId: string;
  deckDict: Dictionary<ClientCard>;
  cardWidth: number;
  className?: string;
};

export function BankClient({ cardId, deckDict, cardWidth, className }: BankClientProps) {
  return (
    <ImageCard
      cardId={deckDict[cardId].imageId}
      cardWidth={cardWidth}
      className={className}
    />
  );
}
