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
        top="1%"
        left="2%"
        width="20cqw"
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
        top="77%"
        centerHorizontal
        width="88cqw"
        className="a-festa-junina-card__effect"
      >
        <Tooltip title={card.effect}>{card.effect}</Tooltip>
      </DynamicCard.Span>

      {/* Count Indicator */}
      <DynamicCard.Span
        bottom="1%"
        centerHorizontal
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
