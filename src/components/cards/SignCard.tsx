import clsx from 'clsx';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Sass
import './SignCard.scss';

type SignCardProps = {
  /**
   * The id of the sign (do not prefix with sign)
   */
  id: string | number;
  /**
   * The width of the sign (default: 72)
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional padding
   */
  padding?: number;
};

/**
 * An alien sign card component.
 */
export function SignCard({
  id,
  width = DEFAULT_SPRITE_SIZE,
  padding = DEFAULT_PADDING,
  className = '',
}: SignCardProps) {
  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      className={clsx('sign-card', className)}
      style={{ width: `${width}px`, height: `${width}px`, ...divPadding }}
    >
      <Sprite source="alien-signs" spriteId={`sign-${id}`} width={width} padding={padding} />
    </div>
  );
}

/**
 * An alien sign sprite component.
 */
export function SignSprite({
  id,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<SignCardProps, 'id' | 'width'> & ElementProps) {
  const signId = id.startsWith('sign') ? id : `sign-${id}`;
  return <Sprite source="alien-signs" spriteId={signId} width={width} padding={0} {...props} />;
}
