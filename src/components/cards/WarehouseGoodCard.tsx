import clsx from 'clsx';
// Components
import { Sprite } from 'components/sprites';
// Sass
import './WarehouseGoodCard.scss';
import { DualTranslate } from 'components/language';

export type WarehouseGoodCardProps = {
  /**
   * The id of the item
   */
  id: string;
  /**
   * The width of the item
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Replacement title, usually the name of the item
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
 * Retrieves the source and item ID based on a given string.
 *
 * @param str - The input string.
 * @returns An array containing the source and item ID.
 */
export const getSource = (str: string) => {
  const match = str.match(/\d+/);
  const numId = match ? parseInt(match[0], 10) : 0;
  const itemId = `good-${numId}`;
  const sourceId = Math.ceil(numId / BASE) * BASE;
  const source = `warehouse-goods-${sourceId}`;
  return [source, itemId];
};

/**
 * An item card component.
 */
export function WarehouseGoodCard({
  id,
  width = 75,
  className,
  title,
  text,
  padding,
}: WarehouseGoodCardProps) {
  const [source, itemId] = getSource(id);

  const height = text ? 'auto' : `${width}px`;

  return (
    <div className={clsx('warehouse-good-card', className)} style={{ width: `${width}px`, height, padding }}>
      <Sprite source={source} id={itemId} width={width} title={title} padding={padding} />
      {Boolean(text) && (
        <span className="warehouse-good-card__text">
          <DualTranslate>{text!}</DualTranslate>
        </span>
      )}
    </div>
  );
}
