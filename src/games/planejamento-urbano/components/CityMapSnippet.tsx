import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { useControls } from 'react-zoom-pan-pinch';
// Components
import { GridMap } from 'components/toolKits/GridMap';
// Internal
import type { City, CityLocationsDict } from '../utils/types';
import { useLocationWidth } from '../utils/custom-hooks';
import { MapSlot } from './MapSlot';

type CityMapSnippetProps = {
  width: number;
  height: number;
  city: City;
  cityLocationsDict: CityLocationsDict;
  mapEvaluations?: Record<string, string>;
  focusedCellId?: string;
};

export function CityMapSnippet({
  city,
  cityLocationsDict,
  mapEvaluations,
  height,
  width,
  focusedCellId,
}: CityMapSnippetProps) {
  const sizes = useWindowSize();
  const cellWidth = useLocationWidth(city.width);

  return (
    <GridMap
      maxWidth={Math.min(height, sizes.width / 2)}
      maxHeight={Math.min(width, sizes.height / 2)}
      grid={city}
      cellComponent={MapSlot}
      cellProps={{ cellWidth, cityLocationsDict, mapEvaluations }}
      additionalContent={<ZoomToLocation focusedCellId={focusedCellId} />}
    />
  );
}

function ZoomToLocation({ focusedCellId }: Pick<CityMapSnippetProps, 'focusedCellId'>) {
  const { zoomToElement } = useControls();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (focusedCellId) {
      zoomToElement(`cell-${focusedCellId}`, 1.1);
    }
  }, [focusedCellId]);

  return null;
}
