import clsx from 'clsx';
// Images
import categories from './category-icons.svg?url';

type CategoryIconProps = {
  /**
   * The category
   */
  category: string;
  /**
   * The width of the icon
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

export function CategoryIcon({ category, width = 35, className = '' }: CategoryIconProps) {
  return (
    <div
      className={clsx('category-icon', className)}
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      <svg
        viewBox="0 0 512 512"
        style={{ width: `${width}px`, height: `${width}px` }}
      >
        <use href={`${categories}#${category}`}></use>
      </svg>
    </div>
  );
}
