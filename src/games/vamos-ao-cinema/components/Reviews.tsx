// Types
import type { MovieReviewCard as MovieReviewCardType } from 'types/tdr';
// Components
import { MovieReviewCard } from 'components/cards/MovieReviewCard';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type ReviewsProps = {
  goodReview: MovieReviewCardType;
  badReview: MovieReviewCardType;
};

export function Reviews({ goodReview, badReview }: ReviewsProps) {
  return (
    <SpaceContainer>
      <div className="movie-reviews">
        <MovieReviewCard type="positive" text={goodReview.text} highlights={goodReview.highlights} />

        <MovieReviewCard type="negative" text={badReview.text} highlights={badReview.highlights} />
      </div>
    </SpaceContainer>
  );
}
