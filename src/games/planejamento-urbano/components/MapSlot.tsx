import clsx from 'clsx';
// Ant Design Resources
import { Tag } from 'antd';
// Icons
import { ConeIcon } from 'icons/ConeIcon';
// Components
import { GridMapCellComponentProps } from 'components/toolKits/GridMap/GridMap';
// Internal
import { CityLocationsDict, Construction, Cone } from '../utils/types';
import { getConeColor } from '../utils/helpers';
import { LocationCard } from './LocationCard';

type MapSlotProps = {
  cellWidth: number;
  cityLocationsDict: CityLocationsDict;
  mapEvaluations?: Record<string, string>;
};

export function MapSlot({
  cell,
  grid,
  cellProps,
}: GridMapCellComponentProps<Construction | Cone | null, MapSlotProps>) {
  const { cityLocationsDict = {}, mapEvaluations = {} } = cellProps ?? {};
  const sizes: React.CSSProperties = {
    width: cellProps?.cellWidth,
    height: cellProps?.cellWidth,
  };

  if (!cell.data) {
    return (
      <div style={sizes} className="city-site city-site--unavailable">
        .
      </div>
    );
  }

  if (cell.data?.locationId) {
    return (
      <div style={sizes} id={`cell-${cell.id}`}>
        <LocationCard
          locationId={cell.data.locationId}
          cityLocationsDict={cityLocationsDict}
          width={Number(sizes.width ?? 75)}
        />
      </div>
    );
  }

  if (cell.data?.coneId) {
    const color = getConeColor(cell.data.coneId);

    const locationId = mapEvaluations[cell.data.coneId];

    return (
      <div style={sizes} className="city-site" id={`cell-${cell.id}`}>
        {locationId && (
          <>
            <span className="city-site--temp-construction-cone">
              <ConeIcon color={color} width={32} />
            </span>
            <LocationCard
              locationId={locationId}
              cityLocationsDict={cityLocationsDict}
              width={Number(sizes.width ?? 75)}
              className={clsx(
                'city-site--temp-construction',
                `city-site--temp-construction-${cell.data?.coneId}`
              )}
            />
          </>
        )}
        <div className="city-site-available">
          <ConeIcon color={color} width={64} />
          <Tag color={color}>{cell.data.coneId ?? 'U'}</Tag>
        </div>
      </div>
    );
  }

  return (
    <div style={sizes} id={`cell-${cell.id}`} className="city-site city-site--unavailable">
      .
    </div>
  );
}
