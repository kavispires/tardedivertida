import clsx from 'clsx';
import type { ReactNode } from 'react';
// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Sass
import styles from './DynamicCard.module.scss';

export type DynamicCardSpanItemProps = {
  /**
   * The content to render inside the span
   */
  children: ReactNode;
  /**
   * Distance from the top edge (use % or cqw units)
   */
  top?: string | number;
  /**
   * Distance from the bottom edge (use % or cqw units)
   */
  bottom?: string | number;
  /**
   * Distance from the left edge (use % or cqw units)
   */
  left?: string | number;
  /**
   * Distance from the right edge (use % or cqw units)
   */
  right?: string | number;
  /**
   * Automatically centers the item horizontally (left: 50%, translateX(-50%))
   */
  centerHorizontal?: boolean;
  /**
   * Automatically centers the item vertically (top: 50%, translateY(-50%))
   */
  centerVertical?: boolean;
  /**
   * Width of the item (highly recommended to use cqw units for responsive scaling)
   */
  width?: string | number;
  /**
   * Optional custom className
   */
  className?: string;
  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
};

/**
 * Positions elements absolutely within a DynamicCard using container query units (cqw)
 */
function DynamicCardSpanItem({
  children,
  top,
  bottom,
  left,
  right,
  centerHorizontal,
  centerVertical,
  width,
  className,
  style,
}: DynamicCardSpanItemProps) {
  // Calculate transform dynamically based on centering props
  let transform = style?.transform || '';
  if (centerHorizontal && centerVertical) {
    transform = 'translate(-50%, -50%)';
  } else if (centerHorizontal) {
    transform = 'translateX(-50%)';
  } else if (centerVertical) {
    transform = 'translateY(-50%)';
  }

  return (
    <span
      className={clsx(styles.dynamicCardItem, className)}
      style={{
        top: centerVertical ? '50%' : top,
        bottom,
        left: centerHorizontal ? '50%' : left,
        right,
        width,
        transform: transform || undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ==========================================
// 2. DYNAMIC CARD BASE
// ==========================================

export type DynamicCardProps = {
  /**
   * The base width of the card in pixels (height is calculated automatically via aspectRatio)
   */
  width: number;
  /**
   * The unique ID of the background image to fetch from TD assets
   */
  backgroundImageId: string;
  /**
   * Optional content to render inside the card
   */
  children?: ReactNode;
  /**
   * The height-to-width ratio (defaults to 1.5 for standard playing card ratio)
   */
  aspectRatio?: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Container-query-enabled wrapper for rendering game cards with responsive scaling
 * To enable preview, use it with general / ComponentPreview
 */
export function DynamicCard({
  width,
  backgroundImageId,
  children,
  aspectRatio = 1.5,
  className,
  style,
  ...rest
}: DynamicCardProps) {
  const baseUrl = useTDBaseUrl('images');

  if (!backgroundImageId) {
    return null;
  }

  const imageURL = backgroundImageId.replace(/-/g, '/');

  return (
    <div
      className={clsx(styles.dynamicCard, className)}
      style={{
        width: `${width}px`,
        height: `${width * aspectRatio}px`,
        backgroundImage: `url(${baseUrl}/${imageURL}.jpg)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// Attach the Span to the Card for clean imports
DynamicCard.Span = DynamicCardSpanItem;
