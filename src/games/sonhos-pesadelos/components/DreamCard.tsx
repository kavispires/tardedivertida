import clsx from 'clsx';
// Components
import { ImageBlurButton, ImageCard } from 'components/image-cards';

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
        id={cardId}
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
