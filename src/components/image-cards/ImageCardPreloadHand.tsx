// Components
import { ImageCard } from './ImageCard';
// Sass
import './ImageCardPreloadHand.scss';

type ImageCardPreloadHandProps = {
  hand: string[];
};
export function ImageCardPreloadHand({ hand }: ImageCardPreloadHandProps) {
  if (!hand) return <span></span>;
  return (
    <div className="image-card-preload-hand">
      {hand.map((cardId) => (
        <ImageCard id={cardId} cardWidth={1} key={`pre-load-${cardId}`} preview={false} />
      ))}
    </div>
  );
}
