/**
 * Types and utilities for the Card Crafter tool
 */

/**
 * Represents a single element (span) in the card editor
 */
export type CardElement = {
  /**
   * Unique identifier for the element
   */
  id: string;
  /**
   * User-editable name for the element
   */
  name: string;
  /**
   * Distance from the top edge
   */
  top?: string;
  /**
   * Distance from the bottom edge
   */
  bottom?: string;
  /**
   * Distance from the left edge
   */
  left?: string;
  /**
   * Distance from the right edge
   */
  right?: string;
  /**
   * Centers the element horizontally
   */
  centerHorizontal?: boolean;
  /**
   * Centers the element vertically
   */
  centerVertical?: boolean;
  /**
   * Width of the element
   */
  width?: string;
  /**
   * Font size
   */
  fontSize?: string;
  /**
   * Aspect ratio
   */
  aspectRatio?: string;
  /**
   * Border radius
   */
  borderRadius?: string;
  /**
   * Padding inside the element
   */
  padding?: string;
  /**
   * Border width
   */
  borderWidth?: string;
  /**
   * Background color for preview
   */
  backgroundColor: string;
  /**
   * Whether the background should be transparent
   */
  transparent: boolean;
};

/**
 * Configuration for the card being designed
 */
export type CardConfig = {
  /**
   * Width of the card in pixels
   */
  width: number;
  /**
   * Aspect ratio (height/width)
   */
  aspectRatio: number;
  /**
   * Background image ID
   */
  backgroundImageId: string;
};

/**
 * Generates a random pastel color for element backgrounds
 */
export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 70 + Math.floor(Math.random() * 15); // 70-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generates a unique ID for elements
 */
export function generateId(): string {
  return `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a default element with initial positioning
 */
export function createDefaultElement(name: string): CardElement {
  return {
    id: generateId(),
    name,
    top: '50%',
    left: '50%',
    centerHorizontal: true,
    centerVertical: true,
    width: '50cqw',
    backgroundColor: generateRandomColor(),
    transparent: false,
  };
}

/**
 * Converts pixel offset to percentage based on card width
 */
export function pixelsToPercent(pixels: number, cardWidth: number): string {
  return `${((pixels / cardWidth) * 100).toFixed(1)}%`;
}

/**
 * Converts pixel offset to cqw units
 */
export function pixelsToCqw(pixels: number, cardWidth: number): string {
  return `${((pixels / cardWidth) * 100).toFixed(1)}cqw`;
}

/**
 * Generates TSX code for DynamicCard.Span elements
 */
export function generateCode(elements: CardElement[]): string {
  if (elements.length === 0) {
    return '// No elements added yet';
  }

  return elements
    .map((element) => {
      const props: string[] = [];

      // Add id attribute using the element name
      props.push(`id="${element.name}"`);

      // Add positioning props
      if (element.top) props.push(`top="${element.top}"`);
      if (element.bottom) props.push(`bottom="${element.bottom}"`);
      if (element.left) props.push(`left="${element.left}"`);
      if (element.right) props.push(`right="${element.right}"`);
      if (element.centerHorizontal) props.push('centerHorizontal');
      if (element.centerVertical) props.push('centerVertical');

      // Add sizing/styling props
      if (element.width) props.push(`width="${element.width}"`);
      if (element.fontSize) props.push(`fontSize="${element.fontSize}"`);
      if (element.aspectRatio) props.push(`aspectRatio="${element.aspectRatio}"`);
      if (element.borderRadius) props.push(`borderRadius="${element.borderRadius}"`);
      if (element.padding) props.push(`padding="${element.padding}"`);
      if (element.borderWidth) props.push(`borderWidth="${element.borderWidth}"`);

      // Format props with proper indentation
      const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';

      return `<DynamicCard.Span${propsString}>\n  {/* ${element.name} content */}\n</DynamicCard.Span>`;
    })
    .join('\n\n');
}

/**
 * Validates if an element is within card bounds
 */
export function isElementOffCanvas(element: CardElement): boolean {
  // Simple check - could be enhanced with actual boundary calculations
  const topValue = element.top ? Number.parseFloat(element.top) : 0;
  const leftValue = element.left ? Number.parseFloat(element.left) : 0;

  return topValue < 0 || topValue > 100 || leftValue < 0 || leftValue > 100;
}
