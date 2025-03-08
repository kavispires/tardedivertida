import clsx from 'clsx';
import { memoize } from 'lodash';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { DualTranslate } from 'components/language';
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
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
export const getSource = memoize((str: string) => {
  const match = str.match(/\d+/);
  const numId = match ? Number.parseInt(match[0], 10) : 0;
  const itemId = `item-${numId}`;
  const sourceId = Math.ceil(numId / BASE) * BASE;
  const source = `items-${sourceId}`;
  return [source, itemId];
});

/**
 * An item card component.
 */
export function ItemCard({
  id,
  width = DEFAULT_SPRITE_SIZE,
  className,
  title,
  text,
  padding = DEFAULT_PADDING,
}: ItemCardProps) {
  const [source, itemId] = getSource(id);

  const height = text ? 'auto' : `${width}px`;
  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div className={clsx('item-card', className)} style={{ width: `${width}px`, height, ...divPadding }}>
      <Sprite source={source} id={itemId} width={width} title={title} padding={padding} />
      {!!text && (
        <span className="item-card__text">
          <DualTranslate>{text}</DualTranslate>
        </span>
      )}
    </div>
  );
}

/**
 * An item sprite component.
 */
export function ItemSprite({
  id,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<ItemCardProps, 'id' | 'width'> & ElementProps) {
  const [source, itemId] = getSource(id);
  return <Sprite source={source} id={itemId} width={width} padding={0} {...props} />;
}
