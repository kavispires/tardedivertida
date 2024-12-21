import { useWindowSize } from 'react-use';
// Components
import { GridMap } from 'components/toolKits/GridMap';
// Internal
import type { City, CityLocationsDict } from '../utils/types';
import { useLocationWidth } from '../utils/custom-hooks';
import { MapSlot } from './MapSlot';

type CityMapProps = {
  city: City;
  cityLocationsDict: CityLocationsDict;
  mapEvaluations?: Record<string, string>;
};

export function CityMap({ city, cityLocationsDict, mapEvaluations }: CityMapProps) {
  const sizes = useWindowSize();
  const cellWidth = useLocationWidth(city.width);

  return (
    <GridMap
      maxWidth={sizes.width}
      maxHeight={sizes.height}
      grid={city}
      cellComponent={MapSlot}
      cellProps={{ cellWidth, cityLocationsDict, mapEvaluations }}
    />
  );
}
