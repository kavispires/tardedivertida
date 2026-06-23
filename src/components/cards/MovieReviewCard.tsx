import clsx from 'clsx';
// Components
import { Translate } from '@components/language/Translate';
import { ParagraphHighlighter } from '@components/text/ParagraphHighlighter';
// Sass
import styles from './MovieReviewCardData.module.scss';

type MovieReviewCardProps = {
  /**
   * The type of review
   */
  type: 'positive' | 'negative';
  /**
   * The review itself
   */
  text: string;
  /**
   * Optional list of words to be highlighted in the review
   */
  highlights?: string[];
  /**
   * Optional custom class name
   */
  className?: string;
};

/**
 * Displays a movie review card with positive or negative styling and optional highlighting
 */
export const MovieReviewCard = ({ type, text, highlights = [], className = '' }: MovieReviewCardProps) => {
  return (
    <div
      className={clsx(
        styles.movieReviewCard,
        type === 'positive' ? styles.movieReviewCardPositive : styles.movieReviewCardNegative,
        className,
      )}
    >
      <span
        className={clsx(
          styles.movieReviewCardHeader,
          type === 'positive' ? styles.movieReviewCardHeaderPositive : styles.movieReviewCardHeaderNegative,
        )}
      >
        {type === 'positive' ? (
          <Translate
            pt="Crítica Positiva"
            en="Positive Review"
          />
        ) : (
          <Translate
            pt="Crítica Negativa"
            en="Negative Review"
          />
        )}
        {type === 'positive' ? ' 👏' : ' 🤮'}
      </span>
      <div className={styles.movieReviewCardContent}>
        <ParagraphHighlighter
          text={text}
          highlights={highlights}
          className={styles.movieReviewCardText}
          highlightClassName={clsx(
            styles.movieReviewCardTextHighlight,
            type === 'positive'
              ? styles.movieReviewCardTextHighlightPositive
              : styles.movieReviewCardTextHighlightNegative,
          )}
        />
      </div>
    </div>
  );
};
