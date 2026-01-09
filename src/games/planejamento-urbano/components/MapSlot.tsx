import clsx from 'clsx';
import { invert } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Tag } from 'antd';
// Icons
import { ConeIcon } from 'icons/ConeIcon';
// Components
import { DroppableArea } from 'components/drag-and-drop';
import type { GridMapCellComponentProps } from 'components/toolKits/GridMap/GridMap';
// Internal
import type { CityLocationsDict, Construction, Cone } from '../utils/types';
import { getConeColor } from '../utils/helpers';
import { LocationCard } from './LocationCard';

type MapSlotProps = {
  /**
   * The width of each cell in the grid map.
   */
  cellWidth: number;
  /**
   * A mapping of city location IDs to their corresponding names.
   */
  cityLocationsDict: CityLocationsDict;
  /**
   * A mapping of location IDs to code IDs representing current evaluations on the map.
   * Key: locationId, Value:  coneId
   */
  mapEvaluations?: Record<string, string>;
  /**
   * Indicates whether drag-and-drop functionality is enabled for the map slots.
   */
  dragAndDropEnabled?: boolean;
};

export function MapSlot({
  cell,
  cellProps,
}: GridMapCellComponentProps<Construction | Cone | null, MapSlotProps>) {
  const { cityLocationsDict = {}, mapEvaluations = {}, dragAndDropEnabled = false } = cellProps ?? {};
  const sizes: React.CSSProperties = {
    width: cellProps?.cellWidth,
    height: cellProps?.cellWidth,
  };

  const evaluations = useMemo(() => {
    return invert(mapEvaluations);
  }, [mapEvaluations]);

  if (!cell.data) {
    return (
      <div
        style={sizes}
        className="city-site city-site--unavailable"
      >
        <span style={{ opacity: 0 }}>.</span>
      </div>
    );
  }

  if (cell.data?.locationId) {
    return (
      <div
        style={sizes}
        id={`cell-${cell.id}`}
      >
        <LocationCard
          locationId={cell.data.locationId}
          cityLocationsDict={cityLocationsDict}
          width={Number(sizes.width ?? 75)}
        />
      </div>
    );
  }

  if (cell.data?.coneId) {
    const coneId = cell.data.coneId;
    const color = getConeColor(coneId);

    const locationId = evaluations[coneId];

    if (dragAndDropEnabled) {
      return (
        <DroppableArea
          id={cell.data.coneId}
          // disabled={!!locationId}
          options={{ withTransition: true }}
          className="city-site--droppable-area"
        >
          <div
            style={sizes}
            className="city-site"
            id={`cell-${cell.id}`}
          >
            {locationId && (
              <>
                <span className="city-site--temp-construction-cone">
                  <ConeIcon
                    color={color}
                    width={32}
                  />
                </span>
                <LocationCard
                  locationId={locationId}
                  cityLocationsDict={cityLocationsDict}
                  width={Number(sizes.width ?? 75)}
                  className={clsx(
                    'city-site--temp-construction',
                    `city-site--temp-construction-${cell.data?.coneId}`,
                  )}
                />
              </>
            )}
            <div className="city-site-available">
              <ConeIcon
                color={color}
                width={64}
              />
              <Tag color={color}>{cell.data.coneId ?? 'U'}</Tag>
            </div>
          </div>
        </DroppableArea>
      );
    }

    return (
      <div
        style={sizes}
        className="city-site"
        id={`cell-${cell.id}`}
      >
        {locationId && (
          <>
            <span className="city-site--temp-construction-cone">
              <ConeIcon
                color={color}
                width={32}
              />
            </span>
            <LocationCard
              locationId={locationId}
              cityLocationsDict={cityLocationsDict}
              width={Number(sizes.width ?? 75)}
              className={clsx(
                'city-site--temp-construction',
                `city-site--temp-construction-${cell.data?.coneId}`,
              )}
            />
          </>
        )}
        <div className="city-site-available">
          <ConeIcon
            color={color}
            width={64}
          />
          <Tag color={color}>{cell.data.coneId ?? 'U'}</Tag>
        </div>
      </div>
    );
  }

  return (
    <div
      style={sizes}
      id={`cell-${cell.id}`}
      className="city-site city-site--unavailable"
    >
      <span style={{ opacity: 0 }}>.</span>
    </div>
  );
}
