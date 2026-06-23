// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { Teller } from '../utils/types';
import { CHARACTER_TYPES } from '../utils/constants';
import { ClientSprite } from './ClientSprite';

type TellerCardProps = {
  teller: Teller;
  cardWidth: number;
};

export function TellerCard({ teller, cardWidth }: TellerCardProps) {
  return (
    <div className="teller-card">
      <Tooltip title={<DualTranslate>{getTellerDescription(teller)}</DualTranslate>}>
        <ImageCard
          cardId={teller.imageId}
          cardWidth={cardWidth}
          preview={false}
        />
        <Flex
          className="teller-card__doublers"
          gap={4}
          vertical
        >
          {teller.doublers.map((id) => (
            <ClientSprite
              spriteId={CHARACTER_TYPES[id].spriteId}
              width={cardWidth / 4}
              className="teller-card__doubler"
              key={id}
            />
          ))}
        </Flex>

        <Flex
          className="teller-card__capacity"
          gap={4}
        >
          {teller.capacity.map((cap, index) => (
            <div
              key={index}
              className="teller-card__capacity-entry"
            >
              {cap}
            </div>
          ))}
        </Flex>
      </Tooltip>
    </div>
  );
}

const getTellerDescription = (teller: Teller) => {
  return {
    en: (
      <>
        Teller: <TextHighlight>{teller.id}</TextHighlight>
        <br />
        Capacity:{' '}
        {teller.capacity.map((cap, index) => (
          <TextHighlight key={index}>{cap}</TextHighlight>
        ))}
        <br />
        Doublers: {teller.doublers.map((id) => CHARACTER_TYPES[id].name.en).join(', ')}
      </>
    ),
    pt: (
      <>
        Caixa: <TextHighlight>{teller.id}</TextHighlight>
        <br />
        Capacidade:{' '}
        {teller.capacity.map((cap, index) => (
          <TextHighlight key={index}>{cap}</TextHighlight>
        ))}
        <br />
        Dobro de pontos: {teller.doublers.map((id) => CHARACTER_TYPES[id].name.pt).join(', ')}
      </>
    ),
  };
};
