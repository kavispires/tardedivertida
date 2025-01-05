import { motion } from 'framer-motion';
import type { DiagramArea } from 'games/teoria-de-conjuntos/utils/types';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { ItemCard } from 'components/cards/ItemCard';
// Utils

const CONTAINER_BOX_WIDTH = 820;
const CONTAINER_BOX_HEIGHT = 720;

export function calculateProportionalValues(containerWidth: number, objectX: number, objectY: number) {
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

export function getCenterPointInArea(containerWidth: number, areaKey: string) {
  const values = {
    A: { x: 145, y: 160 },

    W: { x: 570, y: 160 },

    C: { x: 360, y: 550 },

    AW: { x: 360, y: 140 },

    WC: { x: 490, y: 370 },

    AC: { x: 220, y: 370 },

    AWC: { x: 360, y: 300 },

    O: { x: 670, y: 620 },
  }[areaKey];

  const points = calculateProportionalValues(containerWidth, values?.x ?? 0, values?.y ?? 0);
  const left = points.x;
  const top = points.y;

  return {
    top,
    left,
  };
}

const BOUNDARIES_BY_AREA: Record<string, Point[]> = {
  A: [
    { x: 170, y: 214 },
    { x: 146, y: 282 },
    { x: 213, y: 155 },
    { x: 84, y: 327 },
    { x: 104, y: 180 },
    { x: 224, y: 82 },
    { x: 257, y: 209 },
    { x: 303, y: 82 },
    { x: 82, y: 250 },
    { x: 149, y: 119 },
    { x: 118, y: 400 },
    { x: 215, y: 268 },
    { x: 281, y: 144 },
    { x: 160, y: 338 },
  ],
  W: [
    { x: 650, y: 214 },
    { x: 674, y: 282 },
    { x: 607, y: 155 },
    { x: 736, y: 327 },
    { x: 716, y: 180 },
    { x: 596, y: 82 },
    { x: 563, y: 209 },
    { x: 517, y: 82 },
    { x: 738, y: 250 },
    { x: 671, y: 119 },
    { x: 702, y: 400 },
    { x: 605, y: 268 },
    { x: 539, y: 144 },
    { x: 660, y: 338 },
  ],
  C: [
    { x: 410, y: 619 },
    { x: 340, y: 625 },
    { x: 473, y: 625 },
    { x: 410, y: 546 },
    { x: 278, y: 573 },
    { x: 535, y: 573 },
    { x: 264, y: 636 },
    { x: 549, y: 636 },
    { x: 327, y: 688 },
    { x: 410, y: 701 },
    { x: 344, y: 563 },
    { x: 468, y: 563 },
    { x: 215, y: 565 },
    { x: 598, y: 565 },
    { x: 485, y: 688 },
  ],
  AW: [
    { x: 410, y: 172 },
    { x: 358, y: 164 },
    { x: 461, y: 164 },
    { x: 410, y: 120 },
    { x: 347, y: 225 },
    { x: 410, y: 221 },
    { x: 472, y: 224 },
  ],
  WC: [
    { x: 562, y: 438 },
    { x: 556, y: 348 },
    { x: 619, y: 467 },
    { x: 486, y: 464 },
    { x: 596, y: 398 },
    { x: 526, y: 405 },
    { x: 543, y: 486 },
  ],
  AC: [
    { x: 258, y: 438 },
    { x: 264, y: 348 },
    { x: 201, y: 467 },
    { x: 334, y: 464 },
    { x: 224, y: 398 },
    { x: 294, y: 405 },
    { x: 277, y: 486 },
  ],
  AWC: [
    { x: 410, y: 350 },
    { x: 347, y: 317 },
    { x: 472, y: 317 },
    { x: 410, y: 290 },
    { x: 358, y: 379 },
    { x: 462, y: 379 },
    { x: 410, y: 415 },
  ],
  O: [
    { x: 783, y: 469 },
    { x: 714, y: 532 },
    { x: 783, y: 568 },
    { x: 703, y: 604 },
    { x: 772, y: 632 },
    { x: 662, y: 668 },
    { x: 733, y: 693 },
    { x: 608, y: 728 },
    { x: 680, y: 741 },
    { x: 212, y: 728 },
    { x: 140, y: 741 },
    { x: 158, y: 668 },
    { x: 87, y: 693 },
    { x: 117, y: 604 },
    { x: 48, y: 632 },
    { x: 106, y: 532 },
    { x: 37, y: 568 },
    { x: 37, y: 469 },
    { x: 36, y: 745 },
    { x: 784, y: 745 },
  ],
};

type AreaPlacedItemsProps = {
  areaKey: string;
  diagramArea: DiagramArea;
  containerWidth: number;
};

export function AreaPlacedItems({ areaKey, diagramArea, containerWidth }: AreaPlacedItemsProps) {
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
              <Avatar size={itemWidth} style={{ transform: 'translate(-25%, -25%)' }}>
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
            <ItemCard id={itemId} width={itemWidth} className="bare-item" padding={0} />
          </motion.span>
        );
      })
      .filter(Boolean);
  }, [itemsIds, boundaries, containerWidth, itemWidth]);

  return <>{elements.map((item) => item)}</>;
}
