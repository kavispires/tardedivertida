// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';

type ItemCardEmptyProps = {
  cardWidth: number;
  cardType: 'evidence' | 'weapon';
};

export function ItemCardEmpty({ cardWidth, cardType }: ItemCardEmptyProps) {
  return (
    <CrimeItemCard
      item={{
        id: `dmhk-${cardType === 'evidence' ? 'ev' : 'wp'}-000`,
        type: cardType,
        name: {
          pt: '?',
          en: '?',
        },
      }}
      cardWidth={cardWidth}
      isSelected={false}
      preview={false}
    />
  );
}
