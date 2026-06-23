import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { useControls } from 'react-zoom-pan-pinch';
// Components
import { GridMap } from '@components/toolKits/GridMap';
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

  const maxHeight = Math.min(height, sizes.height / 2);
  const maxWidth = Math.min(width, sizes.width / 2);

  return (
    <GridMap
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      grid={city}
      cellComponent={MapSlot}
      cellProps={{ cellWidth, cityLocationsDict, mapEvaluations }}
      additionalContent={<ZoomToLocation focusedCellId={focusedCellId} />}
      hideControls
    />
  );
}

function ZoomToLocation({ focusedCellId }: Pick<CityMapSnippetProps, 'focusedCellId'>) {
  const { zoomToElement } = useControls();
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to trigger this effect when the focusedCellId changes, not when zoomToElement changes.
  useEffect(() => {
    if (focusedCellId) {
      const timeoutId = setTimeout(() => {
        zoomToElement(`cell-${focusedCellId}`, 1.1);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [focusedCellId]);

  return null;
}
