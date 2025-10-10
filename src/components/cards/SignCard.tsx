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
  signId: string | number;
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
} & ElementProps;

/**
 * An alien sign card component.
 */
export function SignCard({
  signId,
  width = DEFAULT_SPRITE_SIZE,
  padding = DEFAULT_PADDING,
  className = '',
  ...rest
}: SignCardProps) {
  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      {...rest}
      className={clsx('sign-card', className)}
      style={{ ...rest.style, width: `${width}px`, height: `${width}px`, ...divPadding }}
    >
      <Sprite source="alien-signs" spriteId={`sign-${signId}`} width={width} padding={padding} />
    </div>
  );
}

/**
 * An alien sign sprite component.
 */
export function SignSprite({
  signId,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<SignCardProps, 'signId' | 'width'> & ElementProps) {
  const id = String(signId).startsWith('sign') ? String(signId) : `sign-${signId}`;
  return <Sprite source="alien-signs" spriteId={id} width={width} padding={0} {...props} />;
}
