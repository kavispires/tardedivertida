// Components
import { DualTranslate } from 'components/language';
import { ImageCard } from 'components/image-cards';
// Sass
import './SuspectCard.scss';

type SuspectCardProps = {
  /**
   * Suspect object
   */
  suspect: SuspectCard;
  /**
   * Card width
   */
  width: number;
  /**
   * Hide the suspect name
   */
  hideName?: boolean;
};

export function SuspectCard({ suspect, width, hideName }: SuspectCardProps) {
  return (
    <div className="suspect-card" style={{ width: `${width}px` }}>
      <ImageCard imageId={suspect.id} className="suspect-card__image" cardWidth={width} preview={false} />
      {!hideName && (
        <div className="suspect-card__name">
          <DualTranslate>{suspect.name}</DualTranslate>
        </div>
      )}
    </div>
  );
}
