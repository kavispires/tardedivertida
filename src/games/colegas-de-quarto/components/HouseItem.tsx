// Images
import spriteSheet from './colegas-de-quarto-sprite.png';

type HouseItemProps = {
  // Index of the item within the set (0-14)
  index: number;
  // Set number (1, 2, or 3) - each set contains 3 rows
  setId: number;
  // Size in pixels (defaults to 175px - original sprite size)
  size?: number;
};

export function HouseItem({ index, setId, size = 100 }: HouseItemProps) {
  const SPRITE_COLUMNS = 5;
  const SPRITE_ROWS = 9;

  // Calculate column position (0-4)
  const column = index % 5;
  // Calculate row within the set (0-2)
  const rowInSet = Math.floor(index / 5);
  // Calculate absolute row in the sprite sheet
  const absoluteRow = (setId - 1) * 3 + rowInSet;

  // Calculate background position
  const backgroundPositionX = -(column * size);
  const backgroundPositionY = -(absoluteRow * size);

  // Calculate scaled sprite sheet dimensions
  const spriteSheetWidth = SPRITE_COLUMNS * size;
  const spriteSheetHeight = SPRITE_ROWS * size;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${spriteSheet})`,
        backgroundSize: `${spriteSheetWidth}px ${spriteSheetHeight}px`,
        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
