import type { DiagramArea } from 'games/teoria-de-conjuntos/utils/types';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ItemCard } from 'components/cards/ItemCard';

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
    { x: 191, y: 218 },
    { x: 222, y: 131 },
    { x: 108, y: 288 },
    { x: 154, y: 149 },
    { x: 188, y: 292 },
    { x: 296, y: 106 },
    { x: 121, y: 217 },
    { x: 259, y: 195 },
    { x: 249, y: 263 },
    { x: 138, y: 358 },
  ],
  W: [
    { x: 637, y: 240 },
    { x: 640, y: 166 },
    { x: 625, y: 310 },
    { x: 563, y: 246 },
    { x: 513, y: 101 },
    { x: 709, y: 232 },
    { x: 601, y: 99 },
    { x: 700, y: 305 },
    { x: 553, y: 173 },
    { x: 679, y: 374 },
  ],
  C: [
    { x: 378, y: 601 },
    { x: 444, y: 603 },
    { x: 311, y: 569 },
    { x: 511, y: 564 },
    { x: 409, y: 530 },
    { x: 302, y: 635 },
    { x: 523, y: 630 },
    { x: 243, y: 570 },
    { x: 579, y: 563 },
    { x: 413, y: 673 },
  ],
  AW: [
    { x: 405, y: 170 },
    { x: 369, y: 225 },
    { x: 440, y: 225 },
  ],
  WC: [
    { x: 544, y: 387 },
    { x: 510, y: 450 },
    { x: 580, y: 455 },
  ],
  AC: [
    { x: 281, y: 380 },
    { x: 237, y: 446 },
    { x: 312, y: 450 },
  ],
  AWC: [
    { x: 377, y: 337 },
    { x: 431, y: 341 },
    { x: 411, y: 396 },
  ],
  O: [
    { x: 710, y: 552 },
    { x: 669, y: 654 },
    { x: 614, y: 730 },
    { x: 778, y: 480 },
    { x: 759, y: 640 },
    { x: 115, y: 570 },
    { x: 42, y: 569 },
    { x: 203, y: 728 },
    { x: 54, y: 484 },
    { x: 52, y: 644 },
    { x: 86, y: 730 },
    { x: 140, y: 659 },
    { x: 776, y: 567 },
    { x: 745, y: 724 },
  ],
};

type AreaPlacedItemsProps = {
  areaKey: string;
  diagramArea: DiagramArea;
  containerWidth: number;
};

export function AreaPlacedItems({ areaKey, diagramArea, containerWidth }: AreaPlacedItemsProps) {
  const boundaries = BOUNDARIES_BY_AREA[areaKey];

  const itemWidth = containerWidth / 9;

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
            <span key={itemId} style={{ position: 'absolute', left: `${left - 12}px`, top: `${top - 12}px` }}>
              <Avatar size={itemWidth / 2}>+ {itemsIds.length - boundaries.length + 1}</Avatar>
            </span>
          );
        }

        return (
          <span
            key={itemId}
            style={{ position: 'absolute', left: `${left + 12}px`, top: `${top + 12}px` }}
            className={getAnimationClass('bounceIn', { delay: index * 0.5 })}
          >
            <ItemCard id={itemId} width={itemWidth} className="bare-item" />
          </span>
        );
      })
      .filter(Boolean);
  }, [itemsIds, boundaries, containerWidth, itemWidth]);

  return <>{elements.map((item) => item)}</>;
}
