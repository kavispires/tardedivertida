import clsx from 'clsx';
// Design Resources
import { Image, Tooltip } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { PUBLIC_URL } from 'utils/constants';

type WordGridHeaderProps = {
  cell: CruzaPalavrasGridCell;
};

export function WordGridHeader({ cell }: WordGridHeaderProps) {
  if (cell?.id?.startsWith('cnt')) {
    return <WordGridHeaderImage cell={cell} />;
  }

  return <>{cell.text}</>;
}

function WordGridHeaderImage({ cell }: WordGridHeaderProps) {
  const { shouldBeBlurred } = useBlurCards();
  const cardWidth = useCardWidth(8, { gap: 16, minWidth: 30, maxWidth: 100 });

  const imageURL = cell.id!.replace(/-/g, '/');

  const isBlurred = shouldBeBlurred(cell.id);
  return (
    <div className="w-contender" style={{ width: `${cardWidth}px` }}>
      <Tooltip title={cell.text}>
        <span className="w-contender-name">{cell.text}</span>
      </Tooltip>

      <Image
        src={`${process.env.REACT_APP_TDI_IMAGES_URL}${imageURL}.jpg`}
        width={cardWidth}
        className={clsx('w-contender-image', isBlurred && 'w-contender-image--blur')}
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
        alt={cell.text}
      />
    </div>
  );
}
