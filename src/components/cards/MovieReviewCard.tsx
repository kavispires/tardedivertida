import clsx from 'clsx';
// Components
import { Translate } from 'components/language';
import { ParagraphHighlighter } from 'components/text/ParagraphHighlighter';
// Sass
import './MovieReviewCard.scss';

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
        <ParagraphHighlighter
          text={text}
          highlights={highlights}
          className={`${baseClass}__text`}
          highlightClassName={clsx(`${baseClass}__text-highlight`, `${baseClass}__text-highlight--${type}`)}
        />
      </div>
    </div>
  );
};
