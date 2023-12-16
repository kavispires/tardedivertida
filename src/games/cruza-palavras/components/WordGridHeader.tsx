import clsx from 'clsx';
// Design Resources
import { Image, Tooltip } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';

type WordGridHeaderProps = {
  cell: CruzaPalavrasGridCell;
  gridType: CruzaPalavrasGridType;
};

export function WordGridHeader({ cell, gridType }: WordGridHeaderProps) {
  if (gridType === 'contenders') {
    return <WordGridHeaderImage cell={cell} gridType={gridType} />;
  }

  return <>{cell.text}</>;
}

function WordGridHeaderImage({ cell, gridType }: WordGridHeaderProps) {
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
