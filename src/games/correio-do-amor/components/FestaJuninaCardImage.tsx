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
  /**
   * Indicates whether the preview modal is currently open (passed by ComponentPreview)
   */
  isPreviewOpen?: boolean;
};

function FestaJuninaCardImageBase({ card, cardId, width, isPreviewOpen = false }: FestaJuninaCardImageProps) {
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
        top="1.25%"
        left="1.75%"
        width="20cqw"
        aspectRatio="1/1"
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

      {/* Flavor text */}
      <DynamicCard.Span
        top="20%"
        left="50%"
        centerHorizontal
        width="90cqw"
        aspectRatio="3/2"
        className="a-festa-junina-card__flavor-text"
      >
        <Tooltip
          title={<span className="a-festa-junina-card__flavor-text-tooltip">"{card.flavorText}"</span>}
          color="white"
        >
          <span className="a-festa-junina-card__flavor-text-content"> </span>
        </Tooltip>
      </DynamicCard.Span>

      {/* Name Title */}
      <DynamicCard.Span
        top="67%"
        centerHorizontal
        width="90cqw"
        className="a-festa-junina-card__name"
      >
        <Tooltip title={isPreviewOpen ? undefined : card.name}>
          <span>{card.name}</span>
        </Tooltip>
      </DynamicCard.Span>

      {/* Effect Text */}
      <DynamicCard.Span
        top="75%"
        left="50%"
        centerHorizontal
        width="90cqw"
        className="a-festa-junina-card__effect"
        aspectRatio="3 / 1"
      >
        <Tooltip title={isPreviewOpen ? undefined : card.effect}>
          <span>{card.effect}</span>
        </Tooltip>
      </DynamicCard.Span>

      {/* Count Indicator */}
      <DynamicCard.Span
        top="96%"
        left="50%"
        width="5cqw"
        fontSize="4cqw"
        centerHorizontal
        className="a-festa-junina-card__count"
      >
        <Tooltip
          title={
            isPreviewOpen ? undefined : (
              <Translate
                en={`There are ${card.count} ${pluralize(card.count, 'copy', 'copies')} of this card`}
                pt={`Existem ${card.count} ${pluralize(card.count, 'cópia', 'cópias')} desta carta`}
              />
            )
          }
        >
          <span>{card.count}×</span>
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
