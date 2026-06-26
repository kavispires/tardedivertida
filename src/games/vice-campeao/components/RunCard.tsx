import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Components
import { DynamicCard } from '@components/cards/DynamicCard';
import { ComponentPreview } from '@components/general/ComponentPreview';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
// Internal
import type { RunnerCard } from '../utils/types';

type RunCardProps = {
  card: RunnerCard;
  width?: number;
};

function RunCardBase({ card, width = 128 }: RunCardProps) {
  const baseUrl = useTDBaseUrl('images');
  const imageURL = card.imageId.replace(/-/g, '/');

  return (
    <DynamicCard
      width={width}
      backgroundImageId="er-bg-default"
      aspectRatio={1.5}
    >
      {/* Card Illustration */}
      <DynamicCard.Span
        top="3%"
        left="50%"
        centerHorizontal
        width="90cqw"
      >
        <Image
          src={`${baseUrl}/${imageURL}.jpg`}
          fallback={`${baseUrl}/td/d0/00.jpg`}
          preview={false}
          className="run-card__image"
        />
      </DynamicCard.Span>

      {/* Card Name */}
      <DynamicCard.Span
        top="32%"
        right="10%"
        className="run-card__name"
      >
        <DualTranslate>{card.name}</DualTranslate>
      </DynamicCard.Span>

      {/* Description */}
      {card.description && (
        <DynamicCard.Span
          top="44%"
          left="50%"
          centerHorizontal
          width="90cqw"
          className="run-card__description"
        >
          <DualTranslate>{card.description}</DualTranslate>
        </DynamicCard.Span>
      )}

      {/* Value */}
      {card.value !== undefined && (
        <DynamicCard.Span
          top={card.description ? '58%' : '50%'}
          left="50%"
          centerHorizontal
          className={clsx('run-card__value', {
            'run-card__value--positive': card.value > 0,
            'run-card__value--negative': card.value < 0,
            'run-card__value--neutral': card.value === 0,
          })}
        >
          {card.value > 0 && '+'}
          {card.value}
        </DynamicCard.Span>
      )}

      {/* Footer */}
      <DynamicCard.Span
        bottom="2%"
        left="50%"
        centerHorizontal
        width="94cqw"
        className="run-card__footer"
      >
        {getCardTypeName(card)}
      </DynamicCard.Span>
    </DynamicCard>
  );
}

const getCardTypeName = (card: RunnerCard) => {
  return (
    {
      'movement-positive': (
        <Translate
          en="Move Forward"
          pt="Avanço"
        />
      ),
      'movement-negative': (
        <Translate
          en="Move Backward"
          pt="Recuo"
        />
      ),
      'movement-neutral': (
        <Translate
          en="Break"
          pt="Descanso"
        />
      ),
      ongoing: (
        <Translate
          en="Ongoing"
          pt="Durante a rodada"
        />
      ),
      effect: (
        <Translate
          en="Effect"
          pt="Especial"
        />
      ),
    }[card.type] ?? <DualTranslate>{{ pt: 'Carta', en: 'Card' }}</DualTranslate>
  );
};

export function RunCard(props: RunCardProps) {
  return (
    <ComponentPreview aspectRatio={2 / 3}>
      <RunCardBase {...props} />
    </ComponentPreview>
  );
}
