import clsx from 'clsx';
// Components
import { Sprite } from 'components/sprites';
// Sass
import './ItemCard.scss';

export type ItemCardProps = {
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
};

const BASE = 64;

/**
 * Retrieves the source and item ID based on a given string.
 *
 * @param str - The input string.
 * @returns An array containing the source and item ID.
 */
const getSource = (str: string) => {
  const match = str.match(/\d+/);
  const numId = match ? parseInt(match[0], 10) : 0;
  const itemId = `item-${numId}`;
  const sourceId = Math.ceil(numId / BASE) * BASE;
  const source = `items-${sourceId}`;
  return [source, itemId];
};

/**
 * An item card component.
 */
export function ItemCard({ id, width, className, title }: ItemCardProps) {
  const [source, itemId] = getSource(id);

  return (
    <div
      className={clsx('item-card', className)}
      style={{ width: `${width ?? 75}px`, height: `${width ?? 75}px` }}
    >
      <Sprite source={source} id={itemId} width={width} title={title} />
    </div>
  );
}
