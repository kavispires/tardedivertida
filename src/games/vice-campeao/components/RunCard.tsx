import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { RunnerCard } from '../utils/types';

type RunCardProps = {
  card: RunnerCard;
  width?: number;
};

export function RunCard({ card, width = 128 }: RunCardProps) {
  const baseUrl = useTDBaseUrl('images');
  const imageURL = card.imageId.replace(/-/g, '/');

  return (
    <div
      className="run-card"
      style={{
        width: `${width}px`,
        height: `${width * 1.5}px`,
        backgroundImage: `url(${baseUrl}/er/backgrounds/default.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="run-card__illustration">
        <Image
          width={width - 12}
          src={`${baseUrl}/${imageURL}.jpg`}
          fallback={`${baseUrl}/td/d0/00.jpg`}
          preview
          className="run-card__image"
        />
        <div className="run-card__name">
          <DualTranslate>{card.name}</DualTranslate>
        </div>
      </header>

      <div className="run-card__content">
        <div className="run-card__description">
          {card.description && <DualTranslate>{card.description}</DualTranslate>}
        </div>

        {card.value !== undefined && (
          <div
            className={clsx('run-card__value', {
              'run-card__value--positive': card.value > 0,
              'run-card__value--negative': card.value < 0,
              'run-card__value--neutral': card.value === 0,
            })}
          >
            {card.value > 0 && '+'}
            {card.value}
          </div>
        )}
      </div>

      <div className="run-card__footer">
        <span>{getCardTypeName(card)}</span>
      </div>
    </div>
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
