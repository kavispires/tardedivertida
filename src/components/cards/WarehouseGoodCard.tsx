import clsx from 'clsx';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { DualTranslate } from 'components/language';
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Sass
import './WarehouseGoodCard.scss';

export type WarehouseGoodCardProps = {
  /**
   * The id of the warehouse good
   */
  id: string;
  /**
   * The width of the warehouse good
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Replacement title, usually the name of the warehouse good
   */
  title?: string;
  /**
   * Optional text to display
   */
  text?: DualLanguageValue;
  /**
   * Optional padding
   */
  padding?: number;
};

const BASE = 64;

/**
 * Retrieves the source and warehouse good ID based on a given string.
 *
 * @param str - The input string.
 * @returns An array containing the source and warehouse good ID.
 */
export const getSource = (str: string) => {
  const match = str.match(/\d+/);
  const numId = match ? Number.parseInt(match[0], 10) : 0;
  const goodId = `good-${numId}`;
  const sourceId = Math.ceil(numId / BASE) * BASE;
  const source = `warehouse-goods-${sourceId}`;
  return [source, goodId];
};

/**
 * An good card component.
 */
export function WarehouseGoodCard({
  id,
  width = DEFAULT_SPRITE_SIZE,
  className,
  title,
  text,
  padding = DEFAULT_PADDING,
}: WarehouseGoodCardProps) {
  const [source, goodId] = getSource(id);

  const height = text ? 'auto' : `${width}px`;
  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      className={clsx('warehouse-good-card', className)}
      style={{ width: `${width}px`, height, ...divPadding }}
    >
      <Sprite source={source} spriteId={goodId} width={width} title={title} padding={padding} />
      {!!text && (
        <span className="warehouse-good-card__text">
          <DualTranslate>{text}</DualTranslate>
        </span>
      )}
    </div>
  );
}

export function WarehouseGoodSprite({
  id,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<WarehouseGoodCardProps, 'id' | 'width'> & ElementProps) {
  const [source, glyphId] = getSource(id);
  return <Sprite source={source} spriteId={glyphId} width={width} padding={0} {...props} />;
}
