import clsx from 'clsx';
import type React from 'react';
// Components
import {
  ZoomPanPinchContainer,
  type ZoomPanPinchContainerProps,
} from 'components/layout/ZoomPanPinchContainer';
// Internal
import type { GridMapType, GridMapCellType } from './grid-map';
// Sass
import './GridMap.scss';

export type GridMapCellComponentProps<TCellData, TCellAdditionalProps = any> = {
  /**
   * The current cell data.
   */
  cell: GridMapCellType<TCellData | null>;
  /**
   * The full grid data.
   */
  grid: GridMapType<TCellData>;
  /**
   * Additional props passed to the cell component.
   */
  cellProps?: TCellAdditionalProps;
};

export type GridMapProps<TCellData, TCellAdditionalProps = any> = Omit<
  ZoomPanPinchContainerProps,
  'children' | 'wrapperClassName' | 'contentClassName' | 'contentStyle'
> & {
  /**
   * Additional className for the wrapper element.
   */
  className?: string;
  /**
   * Additional className for the content element.
   */
  contentClassName?: string;
  /**
   * Additional CSS styles for the content.
   */
  contentStyle?: React.CSSProperties;
  /**
   * The grid data structure containing cells.
   */
  grid: GridMapType<TCellData>;
  /**
   * Component to render each cell.
   */
  cellComponent: React.ComponentType<GridMapCellComponentProps<TCellData, TCellAdditionalProps>>;
  /**
   * Additional props passed to each cell component.
   */
  cellProps?: any;
  /**
   * Additional content to render above the grid.
   */
  additionalContent?: React.ReactNode;
};

/**
 * A grid map component that provides zoom, pan, and pinch functionality.
 * The container dynamically adjusts its size based on the zoom level and content dimensions.
 */
export function GridMap<TCellData, TCellAdditionalProps = any>({
  grid,
  cellComponent,
  className,
  contentClassName,
  contentStyle = {},
  cellProps,
  additionalContent,
  ...zoomPanPinchProps
}: GridMapProps<TCellData, TCellAdditionalProps>) {
  const CellComponent = cellComponent;

  return (
    <div className="grid-map-container">
      <ZoomPanPinchContainer
        wrapperClassName={clsx('grid-map-outer-window', className)}
        contentClassName={clsx('grid-map', contentClassName)}
        {...zoomPanPinchProps}
      >
        {additionalContent}
        <div
          style={{
            display: 'grid',
            width: 'fit-content',
            gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
            gridTemplateRows: `repeat(${grid.height}, 1fr)`,
          }}
        >
          {grid.cells.map((cell) => (
            <CellComponent
              key={cell.id}
              cell={cell}
              grid={grid}
              cellProps={cellProps}
            />
          ))}
        </div>
      </ZoomPanPinchContainer>
    </div>
  );
}
