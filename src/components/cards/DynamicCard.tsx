import clsx from 'clsx';
import type { ReactNode } from 'react';
// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Sass
import styles from './DynamicCard.module.scss';

export type DynamicCardSpanItemProps = {
  /**
   * The content rendered inside the positioned item
   */
  children: ReactNode;

  // --- POSITIONING ---
  /**
   * Distance from the top edge
   */
  top?: string | number;
  /**
   * Distance from the bottom edge
   */
  bottom?: string | number;
  /**
   * Distance from the left edge
   */
  left?: string | number;
  /**
   * Distance from the right edge
   */
  right?: string | number;
  /**
   * Whether to center the item horizontally
   */
  centerHorizontal?: boolean;
  /**
   * Whether to center the item vertically
   */
  centerVertical?: boolean;

  // --- PROPORTIONAL SCALING (cqw targets) ---
  /**
   * Width of the item, preferably using cqw for responsive scaling
   */
  width?: string | number;
  /**
   * Font size of the item content, preferably using cqw
   */
  fontSize?: string | number;
  /**
   * Aspect ratio used to constrain item proportions
   */
  aspectRatio?: string | number;
  /**
   * Border radius of the item
   */
  borderRadius?: string | number;
  /**
   * Padding inside the item
   */
  padding?: string | number;
  /**
   * Border width of the item
   */
  borderWidth?: string | number;

  // --- STANDARD OVERRIDES ---
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional inline style overrides
   */
  style?: React.CSSProperties;
};

/**
 * Positions content inside a card with absolute coordinates and container-relative sizing.
 */
export function DynamicCardSpanItem({
  children,
  top,
  bottom,
  left,
  right,
  centerHorizontal,
  centerVertical,
  width,
  fontSize,
  aspectRatio,
  borderRadius,
  padding,
  borderWidth,
  className,
  style,
}: DynamicCardSpanItemProps) {
  return (
    <span
      className={clsx(styles.dynamicCardItem, className)}
      style={{
        top: top ?? (centerVertical ? '50%' : undefined),
        bottom,
        left: left ?? (centerHorizontal ? '50%' : undefined),
        right,
        width,
        fontSize,
        aspectRatio,
        borderRadius,
        padding,
        borderWidth,
        translate:
          centerHorizontal || centerVertical
            ? `${centerHorizontal ? '-50%' : '0'} ${centerVertical ? '-50%' : '0'}`
            : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

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
 * Renders a responsive card shell with a dynamic background image and optional overlay content.
 * Use this component with `ComponentPreview` when previewing cards outside gameplay layouts.
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
