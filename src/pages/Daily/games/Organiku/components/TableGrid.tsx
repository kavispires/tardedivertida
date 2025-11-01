import clsx from 'clsx';
import { motion } from 'motion/react';
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { useMemo } from 'react';
// Utils
import { getAnimation } from 'utils/animations';
// Internal
import type { DailyOrganikuEntry } from '../utils/types';
import { getRowAndColumnIndexes } from '../utils/helpers';
import type { useOrganikuEngine } from '../utils/useOrganikuEngine';

type TableGridProps = {
  grid: DailyOrganikuEntry['grid'];
  revealed: BooleanDictionary;
  activeTileIndex: number | null;
  pairActiveTileIndex: number | null;
  onSelectTile?: (index: number) => void;
  foundCount: NumberDictionary;
  itemWidth: number;
  defaultRevealedIndexes: number[];
  tracker: ReturnType<typeof useOrganikuEngine>['tracker'];
};

export function TableGrid({
  grid,
  revealed,
  activeTileIndex,
  onSelectTile,
  foundCount,
  itemWidth,
  defaultRevealedIndexes,
  pairActiveTileIndex,
  tracker,
}: TableGridProps) {
  const gridSize = Math.sqrt(grid.length);
  const unavailableIndexes = useMemo(
    () => (activeTileIndex !== null ? getRowAndColumnIndexes(activeTileIndex, gridSize) : []),
    [activeTileIndex, gridSize],
  );
  const disableButton = activeTileIndex !== null && pairActiveTileIndex !== null;
  return (
    <div
      className="organiku-table-grid"
      style={{ gridTemplateColumns: `repeat(${gridSize}, ${itemWidth}px)` }}
    >
      {grid.map((itemId, index) => {
        const isVisible = revealed[index] || activeTileIndex === index || pairActiveTileIndex === index;
        const isClickable = !revealed[index] && (!disableButton || !unavailableIndexes.includes(index));
        const isBlocked = unavailableIndexes.includes(index);
        const key = `${itemId}-${index}-${activeTileIndex === index || pairActiveTileIndex === index}`;
        const isAllRevealed = foundCount[itemId] === gridSize;
        return (
          <motion.div
            key={key}
            {...getAnimation('flipInY')}
            className={clsx('organiku-table-grid-item', {
              'organiku-table-grid-item--initial': defaultRevealedIndexes.includes(index),
              'organiku-table-grid-item--revealed': isAllRevealed,
              'organiku-table-grid-item--blocked': isBlocked,
              'organiku-table-grid-item--active': activeTileIndex === index || pairActiveTileIndex === index,
              'organiku-table-grid-item--found': foundCount[itemId] === gridSize,
              'organiku-table-grid-item--completed': tracker.completedItems[itemId],
            })}
            onClick={isClickable ? () => onSelectTile?.(index) : undefined}
          >
            {isVisible ? (
              <div
                className="organiku-table-grid-item-content"
                style={{ width: itemWidth, height: itemWidth }}
              >
                <DailyItem itemId={itemId} width={itemWidth} className="transparent" />
              </div>
            ) : (
              <div
                className="organiku-table-grid-item-content"
                style={{ width: itemWidth, height: itemWidth }}
              >
                <DailyItem
                  itemId="0"
                  width={itemWidth / 1.75}
                  className="organiku-table-grid-item-card-placeholder transparent"
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
