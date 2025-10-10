import clsx from 'clsx';
// Ant Design Resources
import { Image, Tooltip } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
// Internal
import type { GridCell, GridType } from '../utils/types';
// Design Resources

type WordGridHeaderProps = {
  cell: GridCell;
  gridType: GridType;
};

export function WordGridHeader(props: WordGridHeaderProps) {
  if (props.gridType === 'contenders') {
    return <WordGridHeaderContender {...props} />;
  }

  if (props.gridType === 'images') {
    return <WordGridHeaderImage {...props} />;
  }

  if (props.gridType === 'items') {
    return <WordGridHeaderItem {...props} />;
  }

  return <>{props.cell.text}</>;
}

function WordGridHeaderContender({ cell }: WordGridHeaderProps) {
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl('images');
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });

  const imageURL = cell.id?.replace(/-/g, '/');

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

function WordGridHeaderImage({ cell }: WordGridHeaderProps) {
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });

  return (
    <div className="w-contender" style={{ width: `${cardWidth}px` }}>
      <ImageBlurButtonContainer cardId={cell.id ?? ''}>
        <ImageCard id={cell.id ?? ''} cardWidth={cardWidth} />
      </ImageBlurButtonContainer>
    </div>
  );
}

function WordGridHeaderItem({ cell }: WordGridHeaderProps) {
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });
  return (
    <div className="w-contender" style={{ width: `${cardWidth}px` }}>
      <ImageBlurButtonContainer cardId={cell.id ?? ''}>
        <ItemCard
          itemId={cell.id ?? ''}
          text={{ pt: cell.text, en: cell.text }}
          width={cardWidth}
          className="transparent-gradient"
        />
      </ImageBlurButtonContainer>
    </div>
  );
}
