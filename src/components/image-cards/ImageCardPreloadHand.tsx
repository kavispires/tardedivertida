// Internal
import { ImageCard } from './ImageCard';
// Sass
import styles from './ImageCardPreloadHand.module.scss';

type ImageCardPreloadHandProps = {
  hand: string[];
};

/**
 * Component that preloads a hand of image cards for performance optimization
 */
export function ImageCardPreloadHand({ hand }: ImageCardPreloadHandProps) {
  if (!hand) return <span></span>;
  return (
    <div className={styles.imageCardPreloadHand}>
      {hand.map((cardId) => (
        <ImageCard
          cardId={cardId}
          cardWidth={1}
          key={`pre-load-${cardId}`}
          preview={false}
        />
      ))}
    </div>
  );
}
