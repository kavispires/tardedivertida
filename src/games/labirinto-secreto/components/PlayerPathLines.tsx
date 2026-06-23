import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Internal
import { calculatePlayerPaths, type PlayerPathSegment } from '../utils/helpers';

type PlayerPathLinesProps = {
  /**
   * All game players with history data
   */
  players: GamePlayers;
  /**
   * The player whose map paths are being visualized
   */
  activePlayerId: UID;
  /**
   * Current segment index to show paths up to
   */
  activeSegmentIndex: number;
  /**
   * Total size of the forest in pixels (used for SVG viewBox)
   */
  forestSize: number;
};

export function PlayerPathLines({
  players,
  activePlayerId,
  activeSegmentIndex,
  forestSize,
}: PlayerPathLinesProps) {
  const pathSegments = useMemo(
    () => calculatePlayerPaths(players, activePlayerId, activeSegmentIndex),
    [players, activePlayerId, activeSegmentIndex],
  );

  if (pathSegments.length === 0) {
    return null;
  }

  // Calculate SVG viewBox dimensions based on forest grid (7x7)
  const cellSize = forestSize / 7;
  const forestWidth = forestSize;
  const forestHeight = forestSize;

  /**
   * Convert grid coordinates to pixel coordinates
   * Centers the point at each tree's position in the 7x7 grid
   */
  const getPixelCoords = (x: number, y: number) => {
    return {
      x: (x + 0.5) * cellSize + 16, // Adding 16px padding to align with tree positions
      y: (y + 0.5) * cellSize + 16, // Adding 16px padding to align with tree positions
    };
  };

  /**
   * Calculate perpendicular offset for parallel lines
   */
  const getOffsetCoords = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    offset: number,
  ): { x1: number; y1: number; x2: number; y2: number } => {
    // Calculate direction vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return { x1, y1, x2, y2 };

    // Calculate perpendicular vector (rotated 90 degrees)
    const perpX = -dy / length;
    const perpY = dx / length;

    // Apply offset
    return {
      x1: x1 + perpX * offset,
      y1: y1 + perpY * offset,
      x2: x2 + perpX * offset,
      y2: y2 + perpY * offset,
    };
  };

  return (
    <svg
      className="forest__player-paths"
      viewBox={`0 0 ${forestWidth} ${forestHeight}`}
      width={forestSize}
      height={forestSize}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <filter
          id="pathGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="4"
            result="blur"
          />
          <feComposite
            in="SourceGraphic"
            in2="blur"
            operator="over"
          />
        </filter>
      </defs>
      <g filter="url(#pathGlow)">
        {pathSegments.map((segment: PlayerPathSegment, index: number, arr) => {
          const [fromX, fromY] = segment.fromPoint;
          const [toX, toY] = segment.toPoint;

          const fromPixel = getPixelCoords(fromX, fromY);
          const toPixel = getPixelCoords(toX, toY);

          const offsetCoords = getOffsetCoords(
            fromPixel.x,
            fromPixel.y,
            toPixel.x,
            toPixel.y,
            segment.offset,
          );

          const color = getAvatarColorById(segment.color);
          const isLastSegmentForPlayer = segment.color !== arr[index + 1]?.color;

          return (
            <line
              key={`${segment.playerId}-${segment.fromTreeId}-${segment.toTreeId}-${index}`}
              x1={offsetCoords.x1}
              y1={offsetCoords.y1}
              x2={offsetCoords.x2}
              y2={offsetCoords.y2 + (isLastSegmentForPlayer ? 36 : 0)}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.9}
              className="forest__player-path-line"
            />
          );
        })}
      </g>
    </svg>
  );
}
