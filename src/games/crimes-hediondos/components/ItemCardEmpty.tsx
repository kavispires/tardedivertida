// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import { CARD_CODES_BY_TYPE } from '../utils/constants';

type ItemCardEmptyProps = {
  cardWidth: number;
  cardType: keyof typeof CARD_CODES_BY_TYPE;
};

export function ItemCardEmpty({ cardWidth, cardType }: ItemCardEmptyProps) {
  const cardCode = CARD_CODES_BY_TYPE[cardType] ?? '';
  return (
    <CrimeItemCard
      item={{
        id: `dmhk-${cardCode}-000`,
        type: cardType,
        name: {
          pt: '?',
          en: '?',
        },
        itemId: '0',
      }}
      cardWidth={cardWidth}
      isSelected={false}
    />
  );
}
