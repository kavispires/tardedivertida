import clsx from 'clsx';
// Design Resources
import { Image, Tooltip } from 'antd';
// Types
import type { GridCell, GridType } from '../utils/types';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

type WordGridHeaderProps = {
  cell: GridCell;
  gridType: GridType;
};

export function WordGridHeader({ cell, gridType }: WordGridHeaderProps) {
  if (gridType === 'contenders') {
    return <WordGridHeaderContender cell={cell} gridType={gridType} />;
  }

  if (gridType === 'images') {
    return <WordGridHeaderImage cell={cell} gridType={gridType} />;
  }

  return <>{cell.text}</>;
}

function WordGridHeaderContender({ cell }: WordGridHeaderProps) {
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl('tdi');
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });

  const imageURL = cell.id!.replace(/-/g, '/');

  const isBlurred = shouldBeBlurred(cell.id);
  return (
    <div className="w-contender" style={{ width: `${cardWidth}px` }}>
      <Tooltip title={cell.text}>
        <span className="w-contender-name">{cell.text}</span>
      </Tooltip>

      <Image
        src={`${baseUrl}/${imageURL}.jpg`}
        width={cardWidth}
        className={clsx('w-contender-image', isBlurred && 'w-contender-image--blur')}
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
        alt={cell.text}
      />
    </div>
  );
}

function WordGridHeaderImage({ cell, gridType }: WordGridHeaderProps) {
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });

  return (
    <div className="w-contender" style={{ width: `${cardWidth}px` }}>
      <ImageBlurButtonContainer cardId={cell.id!}>
        <ImageCard id={cell.id!} cardWidth={cardWidth} />
      </ImageBlurButtonContainer>
    </div>
  );
}
