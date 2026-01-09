import type { DiagramArea } from 'games/teoria-de-conjuntos/utils/types';
import { motion } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { ItemCard } from 'components/cards/ItemCard';
// Utils

const CONTAINER_BOX_WIDTH = 820;
const CONTAINER_BOX_HEIGHT = 648;

function calculateProportionalValues(containerWidth: number, objectX: number, objectY: number) {
  const scaleFactor = containerWidth / CONTAINER_BOX_WIDTH;
  return {
    width: containerWidth,
    height: CONTAINER_BOX_HEIGHT * scaleFactor,
    x: objectX * scaleFactor,
    y: objectY * scaleFactor,
  };
}

type Point = {
  x: number;
  y: number;
};

function getCenterPointInArea(containerWidth: number, areaKey: string) {
  const values = {
    A: { x: 170, y: 324 },

    W: { x: 670, y: 324 },

    AW: { x: 420, y: 324 },

    O: { x: 740, y: 575 },
  }[areaKey];

  const points = calculateProportionalValues(containerWidth, values?.x ?? 0, values?.y ?? 0);
  const left = points.x;
  const top = points.y;

  return {
    top,
    left,
  };
}

export const doubleHelpers = {
  calculateProportionalValues,
  getCenterPointInArea,
};

const BOUNDARIES_BY_AREA: Record<string, Point[]> = {
  A: [
    { x: 148, y: 325 },
    { x: 209, y: 177 },
    { x: 209, y: 461 },
    { x: 170, y: 247 },
    { x: 170, y: 400 },
    { x: 255, y: 236 },
    { x: 232, y: 325 },
    { x: 255, y: 411 },
    { x: 97, y: 253 },
    { x: 76, y: 325 },
    { x: 99, y: 407 },
    { x: 276, y: 127 },
    { x: 276, y: 514 },
    { x: 136, y: 184 },
    { x: 136, y: 470 },
  ],
  W: [
    { x: 670, y: 325 },
    { x: 608, y: 177 },
    { x: 608, y: 461 },
    { x: 647, y: 247 },
    { x: 647, y: 400 },
    { x: 560, y: 236 },
    { x: 586, y: 325 },
    { x: 560, y: 411 },
    { x: 740, y: 253 },
    { x: 720, y: 325 },
    { x: 720, y: 407 },
    { x: 680, y: 127 },
    { x: 680, y: 514 },
    { x: 540, y: 184 },
    { x: 540, y: 470 },
  ],
  AW: [
    { x: 410, y: 325 },
    { x: 410, y: 247 },
    { x: 410, y: 400 },
    { x: 355, y: 269 },
    { x: 465, y: 269 },
    { x: 352, y: 358 },
    { x: 467, y: 358 },
    { x: 410, y: 187 },
    { x: 410, y: 461 },
  ],
  O: [
    { x: 410, y: 600 },
    { x: 345, y: 615 },
    { x: 478, y: 615 },
    { x: 277, y: 615 },
    { x: 544, y: 615 },
    { x: 209, y: 615 },
    { x: 611, y: 615 },
    { x: 142, y: 595 },
    { x: 678, y: 595 },
    { x: 75, y: 575 },
    { x: 744, y: 575 },
    { x: 410, y: 47 },
    { x: 345, y: 32 },
    { x: 478, y: 32 },
    { x: 277, y: 32 },
    { x: 544, y: 32 },
    { x: 209, y: 32 },
    { x: 611, y: 32 },
    { x: 142, y: 51 },
    { x: 678, y: 51 },
    { x: 75, y: 70 },
    { x: 744, y: 70 },
  ],
};

type DoubleAreaPlacedItemsProps = {
  areaKey: string;
  diagramArea: DiagramArea;
  containerWidth: number;
};

export function DoubleAreaPlacedItems({ areaKey, diagramArea, containerWidth }: DoubleAreaPlacedItemsProps) {
  const boundaries = BOUNDARIES_BY_AREA[areaKey];

  const itemWidth = Math.round(containerWidth / 18);

  const { itemsIds } = diagramArea;

  const elements = useMemo(() => {
    return [...itemsIds]
      .reverse()
      .map((itemId, index) => {
        // If more than boundaries list, don't render
        if (index >= boundaries.length) return null;

        const { x, y } = boundaries[index];
        const points = calculateProportionalValues(containerWidth, x, y);
        const left = points.x;
        const top = points.y;

        // If it's the last item, just render the number
        if (index === boundaries.length - 1 && itemsIds.length > boundaries.length) {
          return (
            <motion.span
              key={itemId}
              className="placed-item-wrapper"
              style={{ left: `${left}px`, top: `${top}px` }}
              {...getAnimation('bounceIn', { delay: index * 0.1 })}
            >
              <Avatar
                size={itemWidth}
                style={{ transform: 'translate(-25%, -25%)' }}
              >
                + {itemsIds.length - boundaries.length + 1}
              </Avatar>
            </motion.span>
          );
        }

        return (
          <motion.span
            key={itemId}
            className="placed-item-wrapper"
            style={{ left: `${left}px`, top: `${top}px` }}
            {...getAnimation('bounceIn', { delay: index * 0.1 })}
          >
            <ItemCard
              itemId={itemId}
              width={itemWidth}
              className="bare-item"
              padding={0}
            />
          </motion.span>
        );
      })
      .filter(Boolean);
  }, [itemsIds, boundaries, containerWidth, itemWidth]);

  return <>{elements.map((item) => item)}</>;
}
