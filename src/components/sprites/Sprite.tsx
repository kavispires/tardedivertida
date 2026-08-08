import { useQuery } from '@tanstack/react-query';
import type { CSSProperties } from 'react';
// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';

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
   * The width of the item (default: 72)
   */
  width?: CSSProperties['width'];
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
  padding?: CSSProperties['padding'];
} & ElementProps;

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

  const { isLoading, data, isError } = useQuery({
    queryKey: ['sprite', source],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/${source}.svg`);

      if (!response.ok) {
        throw new Error(`Failed to load sprite source: ${source}`);
      }

      return await response.text();
    },
    enabled: !!spriteId && !!source,
  });
  const containerStyle = {
    width,
    height: width,
    padding,
    boxSizing: 'border-box' as const,
    display: 'grid',
    placeItems: 'center' as const,
    ...style,
  };

  if (isLoading) {
    return (
      <span
        style={containerStyle}
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
        style={containerStyle}
        className={className}
        {...props}
      >
        <WarningOutlined />
      </span>
    );
  }

  return (
    <span
      style={containerStyle}
      className={className}
      {...props}
    >
      <svg
        viewBox="0 0 512 512"
        style={{ width: '100%', height: '100%' }}
      >
        <use
          href={`#${spriteId}`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <foreignObject
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          {title && (
            <Tooltip title={title}>
              <div style={{ background: 'transparent', width: '100%', height: '100vh' }}></div>
            </Tooltip>
          )}
        </foreignObject>
      </svg>
    </span>
  );
}
