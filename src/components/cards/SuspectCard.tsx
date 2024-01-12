// Type
import { SuspectCard as SuspectCardType } from 'types/tdi';
// Components
import { DualTranslate } from 'components/language';
import { ImageCard } from 'components/image-cards';
// Sass
import './SuspectCard.scss';

type SuspectCardProps = {
  /**
   * Suspect object
   */
  suspect: SuspectCardType;
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
      <ImageCard id={suspect.id} className="suspect-card__image" cardWidth={width} preview={false} />
      {!hideName && (
        <div className="suspect-card__name">
          <DualTranslate>{suspect.name}</DualTranslate>
        </div>
      )}
    </div>
  );
}
