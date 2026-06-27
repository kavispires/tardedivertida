import { useMemo } from 'react';
import { useWindowSize } from 'react-use';
// Components
import { GridMap } from '@components/toolKits/GridMap';
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

  const { maxWidth, maxHeight } = useMemo(() => {
    // Calculate the actual content dimensions based on grid size
    const contentWidth = city.width * cellWidth;
    const contentHeight = city.height * cellWidth;
    const aspectRatio = contentWidth / contentHeight;

    // Calculate max dimensions based on window size and aspect ratio
    const maxDimension = Math.min(sizes.width, sizes.height) * 0.85;
    const maxWidth = aspectRatio >= 1 ? maxDimension : maxDimension * aspectRatio;
    const maxHeight = aspectRatio >= 1 ? maxDimension / aspectRatio : maxDimension;
    return { maxWidth, maxHeight };
  }, [sizes.width, sizes.height, city.width, city.height, cellWidth]);

  return (
    <GridMap
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      grid={city}
      persistentZoomKey="planejamento-urbano"
      transformWrapperProps={{ initialScale: 0.5 }}
      cellComponent={MapSlot}
      cellProps={{ cellWidth, cityLocationsDict, mapEvaluations, dragAndDropEnabled }}
      contentClassName="city-map"
      lockControlsOnInit
    />
  );
}
