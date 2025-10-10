import Tooltip from 'antd/lib/tooltip';
import clsx from 'clsx';
// Images
import trees from 'assets/images/trees.svg?url';
// Sass
import './TreeCard.scss';

type TreeCardProps = {
  /**
   * The id of the item
   */
  treeId: string | number;
  /**
   * The width of the item
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * The text to be displayed on the card
   */
  text?: string;
} & ElementProps;

/**
 * A tree card component.
 */
export function TreeCard({ treeId, width = 100, className = '', text = '', ...rest }: TreeCardProps) {
  return (
    <div {...rest} className={clsx('tree-card', className)} style={{ ...rest.style, width: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={`${trees}#tree-${treeId}`}></use>
      </svg>
      <Tooltip title={text}>
        <div className="tree-card__text">{text}</div>
      </Tooltip>
    </div>
  );
}
