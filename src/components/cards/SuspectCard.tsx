// Components
import { DualTranslate } from 'components/language';
import { ImageCard } from 'components/image-cards';
// Sass
import './SuspectCard.scss';

type SuspectCardProps = {
  /**
   * Suspect object
   */
  suspect: Suspect;
  /**
   * Card width
   */
  width: number;
};

export function SuspectCard({ suspect, width }: SuspectCardProps) {
  return (
    <div className="suspect-card" style={{ width: `${width}px` }}>
      <ImageCard imageId={suspect.id} className="suspect-card__image" cardWidth={width} preview={false} />
      <div className="suspect-card__name">
        <DualTranslate>{suspect.name}</DualTranslate>
      </div>
    </div>
  );
}
