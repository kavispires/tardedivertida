import clsx from 'clsx';
import type { ReactNode } from 'react';
// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Sass
import styles from './DynamicCard.module.scss';

export type DynamicCardSpanItemProps = {
  children: ReactNode;
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  /** Automatically centers the item horizontally (left: 50%, translateX(-50%)) */
  centerHorizontal?: boolean;
  /** Automatically centers the item vertically (top: 50%, translateY(-50%)) */
  centerVertical?: boolean;
  /** Width of the item. Highly recommended to use 'cqw' units here (e.g. '20cqw') */
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A companion component for positioning elements absolutely within a DynamicCard.
 *
 * @example
 * <DynamicCard.Span top="67%" centerHorizontal width="90cqw">
 *   <h1>Card Title</h1>
 * </DynamicCard.Span>
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
  /** The base width of the card. Height is calculated automatically via aspectRatio. */
  width: number;
  /** The unique ID of the background image to fetch from the TD assets. */
  backgroundImageId: string;
  children?: ReactNode;
  /**
   * The height-to-width ratio.
   * @default 1.5 (Standard playing card ratio where height = width * 1.5)
   */
  aspectRatio?: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A flexible, container-query-enabled wrapper for rendering game cards.
 *
 * This component establishes a `container-type: size` boundary. This is a modern CSS
 * feature that allows child elements to size themselves relative to this card rather
 * than the whole browser window.
 *
 * **How to use `cqw` (Container Query Width):**
 * `1cqw` is exactly 1% of this card's width.
 * If you set a child's font-size to `5cqw`, it will always be exactly 5% of the card's
 * width, perfectly maintaining its scale whether the card is 100px or 800px wide!
 *
 * @example
 * <DynamicCard width={200} backgroundImageId="bg-123">
 *   <DynamicCard.Span top="1%" left="2%" width="20cqw">
 *     Badge
 *   </DynamicCard.Span>
 * </DynamicCard>
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
