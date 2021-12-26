// Components
import ImageCard from './ImageCard';

type ImageCardPreloadHandProps = {
  hand: string[];
};
export function ImageCardPreloadHand({ hand }: ImageCardPreloadHandProps) {
  if (!hand) return <span></span>;
  return (
    <div className="image-card-preload-hand">
      {hand.map((cardId) => (
        <ImageCard imageId={cardId} cardWidth={1} key={`pre-load-${cardId}`} />
      ))}
    </div>
  );
}
