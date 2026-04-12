// Types
import type { GamePlayer } from 'types/game';
// Components
import { Card } from 'components/cards/Card';

type StorytellingCardProps = {
  story: string;
  storyteller: GamePlayer;
};

export function StorytellingCard({ story, storyteller }: StorytellingCardProps) {
  return (
    <div className="c-story-card__container">
      <Card
        hideHeader
        className="c-story-card"
      >
        {story}
      </Card>
      <div className="c-story-card__storyteller">{storyteller.name}</div>
    </div>
  );
}
