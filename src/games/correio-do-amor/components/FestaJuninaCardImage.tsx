// Ant Design Resources
import { Tooltip } from 'antd';
// Utils
import { pluralize } from '@utils/helpers';
// Components
import { DynamicCard } from '@components/cards/DynamicCard';
import { ComponentPreview } from '@components/general/ComponentPreview';
import { Translate } from '@components/language/Translate';
// Internal
import type { FestaJuninaCard } from '../utils/types';

type FestaJuninaCardImageProps = {
  card: FestaJuninaCard;
  cardId: UID;
  width: number;
};

function FestaJuninaCardImageBase({ card, cardId, width }: FestaJuninaCardImageProps) {
  if (!card) {
    return null;
  }

  return (
    <DynamicCard
      key={cardId}
      width={width}
      backgroundImageId={card.imageId}
      className="a-festa-junina-card"
    >
      {/* Rank Badge */}
      <DynamicCard.Span
        top="8.4%"
        left="12.5%"
        centerHorizontal
        centerVertical
        width="19cqw"
        aspectRatio="1/1"
        padding="5%"
        borderWidth="2cqw"
        className="a-festa-junina-card__rank"
        style={{
          backgroundColor: card.color,
          color: `contrast-color(${card.color})`,
          borderColor: `color-mix(in oklab, ${card.color}, black 10%)`,
        }}
      >
        {card.rank}
      </DynamicCard.Span>

      {/* Name Title */}
      <DynamicCard.Span
        top="67%"
        centerHorizontal
        width="90cqw"
        className="a-festa-junina-card__name"
      >
        <Tooltip title={card.name}>{card.name}</Tooltip>
      </DynamicCard.Span>

      {/* Effect Text */}
      <DynamicCard.Span
        top="70%"
        left="50%"
        centerHorizontal
        centerVertical
        width="90cqw"
        className="a-festa-junina-card__effect"
      >
        <Tooltip title={card.effect}>{card.effect}</Tooltip>
      </DynamicCard.Span>

      {/* Count Indicator */}
      <DynamicCard.Span
        top="86.4%"
        left="50.0%"
        centerHorizontal
        centerVertical
        width="90cqw"
        fontSize="4cqw"
        aspectRatio="3 / 1"
        className="a-festa-junina-card__count"
      >
        <Tooltip
          title={
            <Translate
              en={`There are ${card.count} ${pluralize(card.count, 'copy', 'copies')} of this card`}
              pt={`Existem ${card.count} ${pluralize(card.count, 'cópia', 'cópias')} desta carta`}
            />
          }
        >
          {card.count}×
        </Tooltip>
      </DynamicCard.Span>
    </DynamicCard>
  );
}

export function FestaJuninaCardImage(props: FestaJuninaCardImageProps) {
  return (
    <ComponentPreview aspectRatio={2 / 3}>
      <FestaJuninaCardImageBase {...props} />
    </ComponentPreview>
  );
}
