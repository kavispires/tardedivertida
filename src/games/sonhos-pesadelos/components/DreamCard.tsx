import clsx from 'clsx';
// Components
import { ImageBlurButton } from 'components/image-cards/ImageBlurButton';
import { ImageCard } from 'components/image-cards/ImageCard';

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
  hideBlurButton = false,
}: DreamCardProps) {
  const baseClass = 's-dream-board-card';

  return (
    <>
      <ImageCard
        cardId={cardId}
        cardWidth={cardWidth}
        className={clsx(
          baseClass,
          isDream && `${baseClass}--dream`,
          isNightmare && `${baseClass}--nightmare`,
        )}
      />
      {!hideBlurButton && <ImageBlurButton cardId={cardId} />}
    </>
  );
}
