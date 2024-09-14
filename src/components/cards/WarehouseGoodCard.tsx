import clsx from 'clsx';
// Components
import { DualTranslate } from 'components/language';
import { Sprite } from 'components/sprites';
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
  const numId = match ? parseInt(match[0], 10) : 0;
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
  width = 75,
  className,
  title,
  text,
  padding,
}: WarehouseGoodCardProps) {
  const [source, goodId] = getSource(id);

  const height = text ? 'auto' : `${width}px`;

  return (
    <div className={clsx('warehouse-good-card', className)} style={{ width: `${width}px`, height, padding }}>
      <Sprite source={source} id={goodId} width={width} title={title} padding={padding} />
      {Boolean(text) && (
        <span className="warehouse-good-card__text">
          <DualTranslate>{text!}</DualTranslate>
        </span>
      )}
    </div>
  );
}
