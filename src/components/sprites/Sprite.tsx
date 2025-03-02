import { useQuery } from '@tanstack/react-query';
// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

type SpriteProps = {
  /**
   * The sprite source name
   */
  source: string;
  /**
   * The id of the item
   */
  id: string;
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
   *
   */
  padding?: number;
} & ElementProps;

/**
 * Loads a sprite from the Tarde Divertida sprites
 * @param {SpriteProps} props
 * @returns a single sprite item
 */
export function Sprite({
  id,
  source,
  width = 75,
  padding = 6,
  title,
  className,
  style,
  ...props
}: SpriteProps) {
  const baseUrl = useTDBaseUrl('sprites');

  const { isLoading, data, isError } = useQuery({
    queryKey: ['sprite', source],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/sprites/${source}.svg`);
      return await response.text();
    },
    enabled: !!id && !!source,
  });

  const paddedWidth = width - padding * 2;

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
      <svg viewBox="0 0 512 512" style={{ width: `${paddedWidth}px`, height: `${paddedWidth}px` }}>
        <use xlinkHref={`#${id}`} dangerouslySetInnerHTML={{ __html: svgContent }} />
        <foreignObject x="0" y="0" width="100%" height="100%">
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
