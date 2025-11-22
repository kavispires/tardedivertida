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
  dragAndDropEnabled?: boolean;
};

export function CityMap({ city, cityLocationsDict, mapEvaluations, dragAndDropEnabled }: CityMapProps) {
  const sizes = useWindowSize();
  const cellWidth = useLocationWidth(city.width);
  const max = Math.min(sizes.width, sizes.height) * 0.85;

  return (
    <GridMap
      maxWidth={max}
      maxHeight={max}
      grid={city}
      transformWrapperProps={{ initialScale: 0.5 }}
      cellComponent={MapSlot}
      cellProps={{ cellWidth, cityLocationsDict, mapEvaluations, dragAndDropEnabled }}
    />
  );
}
