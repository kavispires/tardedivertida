// Ant Design Resources
import { Space } from 'antd';
// Types
import type { MovieReviewCard as MovieReviewCardType } from 'types/tdr';
// Components
import { MovieReviewCard } from 'components/cards/MovieReviewCard';

type ReviewsProps = {
  goodReview: MovieReviewCardType;
  badReview: MovieReviewCardType;
};

export function Reviews({ goodReview, badReview }: ReviewsProps) {
  return (
    <Space className="space-container">
      <MovieReviewCard type="positive" text={goodReview.text} highlights={goodReview.highlights} />

      <MovieReviewCard type="negative" text={badReview.text} highlights={badReview.highlights} />
    </Space>
  );
}
