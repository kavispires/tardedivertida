// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { ImageCard } from 'components/image-cards/ImageCard';
// Internal
import type { Teller } from '../utils/types';

type TellerCardProps = {
  teller: Teller;
  cardWidth: number;
};

export function TellerCard({ teller, cardWidth }: TellerCardProps) {
  return (
    <Tooltip
      title={`Teller: ${teller.id}\nCapacity: ${teller.capacity.join(', ')}\nDoublers: ${teller.doublers.join(', ')}`}
    >
      <ImageCard
        cardId={teller.imageId}
        cardWidth={cardWidth}
      />
    </Tooltip>
  );
}
