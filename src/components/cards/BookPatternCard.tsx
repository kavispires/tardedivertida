import clsx from 'clsx';
// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Sass
import './BookPatternCard.scss';

type BookPatternCardProps = {
  patternId: string;
  cardWidth: number;
};

const FOLDER_PREFIX = 'slbc';

export function BookPatternCard({ patternId, cardWidth }: BookPatternCardProps) {
  if (patternId === 'wildcard') {
    return (
      <Tooltip title={<DualTranslate>{TRANSLATIONS.wildcard}</DualTranslate>}>
        <div
          className={clsx('book-pattern-card')}
          style={{ width: cardWidth }}
        >
          <ImageCard
            cardId={`${FOLDER_PREFIX}-wildcard`}
            cardWidth={cardWidth}
          />
        </div>
      </Tooltip>
    );
  }

  const [color, genre, letter] = patternId.split('-');
  const cardId = `${FOLDER_PREFIX}-${color}-${genre}`; // senso-literario-book-card

  return (
    <Tooltip
      title={
        <Flex gap={6}>
          <DualTranslate>{TRANSLATIONS[color]}</DualTranslate>
          <span>+</span>
          <DualTranslate>{TRANSLATIONS[genre]}</DualTranslate>
          <span>+</span>
          {letter}
        </Flex>
      }
    >
      <div
        className={clsx('book-pattern-card')}
        style={{ width: cardWidth }}
      >
        <div className="book-pattern-card__letter">{letter}</div>
        <ImageCard
          cardId={cardId}
          cardWidth={cardWidth}
        />
      </div>
    </Tooltip>
  );
}

const TRANSLATIONS: Dictionary<DualLanguageValue> = {
  wildcard: { pt: 'Coringa', en: 'Wildcard' },
  blue: { pt: 'Azul', en: 'Blue' },
  red: { pt: 'Vermelho', en: 'Red' },
  yellow: { pt: 'Amarelo', en: 'Yellow' },
  romance: { pt: 'Romance', en: 'Romance' },
  childrens: { pt: 'Infantil', en: 'Children' },
  technical: { pt: 'Técnico', en: 'Technical' },
};
