import clsx from 'clsx';
// Images
import trees from 'assets/images/trees.svg';
// Sass
import './TreeCard.scss';

type TreeCardProps = {
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
};

export function TreeCard({ id, width = 75, className = '' }: TreeCardProps) {
  return (
    <div className={clsx('tree-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={trees + `#tree-${id}`}></use>
      </svg>
    </div>
  );
}
