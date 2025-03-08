import clsx from 'clsx';
// Components
import { Sprite } from 'components/sprites';
// Sass
import './SignCard.scss';

type SignCardProps = {
  /**
   * The id of the sign (do not prefix with sign)
   */
  id: string | number;
  /**
   * The width of the sign
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

/**
 * An alien sign card component.
 */
export function SignCard({ id, width = 50, className = '' }: SignCardProps) {
  return (
    <div className={clsx('sign-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <Sprite source="alien-signs" id={`sign-${id}`} width={width} />
    </div>
  );
}

/**
 * An alien sign sprite component.
 */
export function SignSprite({ id, width = 64, ...props }: Pick<SignCardProps, 'id' | 'width'> & ElementProps) {
  const signId = id.startsWith('sign') ? id : `sign-${id}`;
  return <Sprite source="alien-signs" id={signId} width={width} padding={0} {...props} />;
}
