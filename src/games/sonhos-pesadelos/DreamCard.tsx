import clsx from 'clsx';
// Components
import { ImageCard, ImageBlurButton, ImageCardBack } from '../../components';

type DreamCardProps = {
  cardId: string;
  cardWidth: number;
  isDream?: boolean;
  isNightmare?: boolean;
  flipped?: boolean;
  hideBlurButton?: boolean;
};

export function DreamCard({
  cardId,
  cardWidth,
  isDream = false,
  isNightmare = false,
  flipped = false,
  hideBlurButton = false,
}: DreamCardProps) {
  const baseClass = 's-dream-board-card';

  if (flipped) {
    return <ImageCardBack className={baseClass} cardWidth={cardWidth} />;
  }

  return (
    <>
      <ImageCard
        imageId={cardId}
        cardWidth={cardWidth}
        className={clsx(
          baseClass,
          isDream && `${baseClass}--dream`,
          isNightmare && `${baseClass}--nightmare`
        )}
      />
      {!hideBlurButton && <ImageBlurButton cardId={cardId} />}
    </>
  );
}
