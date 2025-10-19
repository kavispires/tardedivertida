import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

export const DEFAULT_SPRITE_SIZE = 72;

type SpriteProps = {
  /**
   * The sprite source name
   */
  source: string;
  /**
   * The id of the item
   */
  spriteId: string;
  /**
   * The width of the item
   */
  width?: number;
  /**
   * Replacement title, usually the name of the item
   */
  title?: string;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional padding
   */
  padding?: number;
} & ElementProps;

// Global cache to track which sprite sheets have been loaded into the DOM
const loadedSpriteSheets = new Set<string>();

/**
 * Loads a sprite from the Tarde Divertida sprites
 * @param {SpriteProps} props
 * @returns a single sprite item
 */
export function Sprite({
  spriteId,
  source,
  width = DEFAULT_SPRITE_SIZE,
  padding = 0,
  title,
  className,
  style,
  ...props
}: SpriteProps) {
  const baseUrl = useTDBaseUrl('sprites');
  const spriteContainerRef = useRef<HTMLDivElement>(null);

  const { isLoading, data, isError } = useQuery({
    queryKey: ['sprite', source],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/sprites/${source}.svg`);
      return await response.text();
    },
    enabled: !!spriteId && !!source,
  });

  const paddedWidth = width - padding * 2;

  // Insert the sprite sheet into the DOM once per source
  useEffect(() => {
    if (data && !loadedSpriteSheets.has(source)) {
      // Create a hidden container for the sprite sheet if it doesn't exist
      let spriteSheetContainer = document.getElementById(`sprite-sheet-${source}`);

      if (!spriteSheetContainer) {
        spriteSheetContainer = document.createElement('div');
        spriteSheetContainer.id = `sprite-sheet-${source}`;
        spriteSheetContainer.style.display = 'none';
        spriteSheetContainer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(spriteSheetContainer);

        // Parse and insert the SVG content safely
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        if (svgElement.nodeName === 'svg') {
          spriteSheetContainer.appendChild(svgElement);
          loadedSpriteSheets.add(source);
        }
      }
    }
  }, [data, source]);

  if (isLoading) {
    return (
      <span
        style={{
          width: `${paddedWidth}px`,
          height: `${paddedWidth}px`,
          padding,
          display: 'grid',
          placeItems: 'center',
          ...style,
        }}
        className={className}
        {...props}
      >
        <Spin />
      </span>
    );
  }

  const svgContent = data;

  if (isError || !svgContent) {
    return (
      <span
        style={{
          width: `${paddedWidth}px`,
          height: `${paddedWidth}px`,
          padding,
          display: 'grid',
          placeItems: 'center',
          ...style,
        }}
        className={className}
        {...props}
      >
        <WarningOutlined />
      </span>
    );
  }

  return (
    <span
      ref={spriteContainerRef}
      style={{
        width: `${paddedWidth}px`,
        height: `${paddedWidth}px`,
        padding,
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
      className={className}
      {...props}
    >
      <svg
        viewBox="0 0 512 512"
        style={{ width: `${paddedWidth}px`, height: `${paddedWidth}px` }}
        role="img"
        aria-label={title || spriteId}
      >
        <use href={`#${spriteId}`} />
        <foreignObject x="0" y="0" width="100%" height="100%">
          {title && (
            <Tooltip title={title}>
              <div
                style={{
                  background: 'transparent',
                  width: '100%',
                  height: '100vh',
                }}
              />
            </Tooltip>
          )}
        </foreignObject>
      </svg>
    </span>
  );
}
