import clsx from 'clsx';
// Components
import HighlighterImport from 'react-highlight-words';
import { Translate } from 'components/language';
// Sass
import './MovieReviewCard.scss';

// TODO: Verify
const Highlighter = HighlighterImport as any;

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

export const MovieReviewCard = ({ type, text, highlights = [], className = '' }: MovieReviewCardProps) => {
  const baseClass = 'movie-review-card';

  return (
    <div className={clsx(baseClass, `${baseClass}--${type}`, className)}>
      <span className={`${baseClass}__header`}>
        {type === 'positive' ? (
          <Translate pt="Crítica Positiva" en="Positive Review" />
        ) : (
          <Translate pt="Crítica Negativa" en="Negative Review" />
        )}
        {type === 'positive' ? ' 👏' : ' 🤮'}
      </span>
      <div className={`${baseClass}__content`}>
        <Highlighter
          className={`${baseClass}__text`}
          highlightClassName={clsx(`${baseClass}__text-highlight`, `${baseClass}__text-highlight--${type}`)}
          searchWords={highlights}
          autoEscape={true}
          textToHighlight={text}
        />
      </div>
    </div>
  );
};
