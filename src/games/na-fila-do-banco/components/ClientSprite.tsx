// Images
import bankSprite from './bank-sprite.png';

type ClientSpriteProps = {
  /**
   * The id of the client (0-6)
   */
  spriteId: number;
  /**
   * The width of the displayed sprite portion in pixels
   */
  width: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Displays a specific client from the bank sprite sheet
 */
export function ClientSprite({ spriteId, width, ...rest }: ClientSpriteProps) {
  const totalSprites = 7;
  const spriteIndex = Math.max(0, Math.min(spriteId, totalSprites - 1));

  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${width}px`,
    backgroundImage: `url(${bankSprite})`,
    backgroundSize: `${totalSprites * 100}% 100%`,
    backgroundPosition: `${(spriteIndex * 100) / (totalSprites - 1)}% 0`,
    backgroundRepeat: 'no-repeat',
    ...rest.style,
  };

  return (
    <div
      className="client-sprite"
      style={style}
      {...rest}
    />
  );
}
