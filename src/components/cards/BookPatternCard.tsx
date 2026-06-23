import clsx from 'clsx';
// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
// Sass
import styles from './BookPatternCard.module.scss';

type BookPatternCardProps = {
  /**
   * The unique identifier for the book pattern
   */
  patternId: string;
  /**
   * The width of the card in pixels
   */
  cardWidth: number;
};

const FOLDER_PREFIX = 'slbc';

/**
 * Displays a book pattern card for the library game with tooltip and image
 */
export function BookPatternCard({ patternId, cardWidth }: BookPatternCardProps) {
  if (patternId === 'wildcard') {
    return (
      <Tooltip title={<DualTranslate>{TRANSLATIONS.wildcard}</DualTranslate>}>
        <div
          className={clsx(styles.bookPatternCard)}
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
        className={clsx(styles.bookPatternCard)}
        style={{ width: cardWidth }}
      >
        <div className={styles.bookPatternCardLetter}>{letter}</div>
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
