// Types
import type { GamePlayer } from 'types/game';
// Components
import { TextCard } from '@components/cards/TextCard';

type StorytellingCardProps = {
  story: string;
  storyteller: GamePlayer;
};

export function StorytellingCard({ story, storyteller }: StorytellingCardProps) {
  return (
    <div className="c-story-card__container">
      <TextCard className="c-story-card">{story}</TextCard>
      <div className="c-story-card__storyteller">{storyteller.name}</div>
    </div>
  );
}
