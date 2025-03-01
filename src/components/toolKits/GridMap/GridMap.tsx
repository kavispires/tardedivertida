import clsx from 'clsx';
import type React from 'react';
import { type ComponentProps, Fragment } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
// Ant Design Resources
import { FullscreenExitOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Internal
import type { GridMapType, GridMapCellType } from './grid-map';
// Sass
import './GridMap.scss';

export type GridMapCellComponentProps<TCellData, TCellAdditionalProps = any> = {
  cell: GridMapCellType<TCellData | null>;
  grid: GridMapType<TCellData>;
  cellProps?: TCellAdditionalProps;
};

export type GridMapProps<TCellData, TCellAdditionalProps = any> = {
  maxWidth: number;
  maxHeight?: number | 'auto';
  className?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  grid: GridMapType<TCellData>;
  cellComponent: React.ComponentType<GridMapCellComponentProps<TCellData, TCellAdditionalProps>>;
  cellProps?: any;
  transformWrapperProps?: ComponentProps<typeof TransformWrapper>;
  hideControls?: boolean;
  additionalContent?: React.ReactNode;
};

export function GridMap<TCellData, TCellAdditionalProps = any>({
  maxWidth,
  maxHeight,
  grid,
  cellComponent,
  className,
  contentClassName,
  contentStyle = {},
  cellProps,
  transformWrapperProps,
  hideControls = false,
  additionalContent,
}: GridMapProps<TCellData, TCellAdditionalProps>) {
  const CellComponent = cellComponent;

  const {
    initialScale = 1,
    minScale = 0.25,
    maxScale = 4,
    wheel = { step: 0.5 },
    centerOnInit = true,
    ...restTransformWrapperProps
  } = transformWrapperProps ?? {};

  return (
    <div className={clsx('grid-map-container')}>
      <TransformWrapper
        initialScale={initialScale}
        minScale={minScale}
        maxScale={maxScale}
        wheel={wheel}
        centerOnInit={centerOnInit}
        {...restTransformWrapperProps}
      >
        <Fragment>
          {!hideControls && <GridMapControls position="top" />}
          {additionalContent}

          <TransformComponent
            wrapperClass={clsx('grid-map-wrapper', className)}
            wrapperStyle={{ maxWidth, maxHeight }}
            contentClass={clsx('grid-map', contentClassName)}
            contentStyle={{
              display: 'grid',
              gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
              gridTemplateRows: `repeat(${grid.height}, 1fr)`,
              ...contentStyle,
            }}
          >
            {grid.cells.map((cell: GridMapCellType<TCellData | null>) => (
              <CellComponent key={cell.id} cell={cell} grid={grid} cellProps={cellProps} />
            ))}
          </TransformComponent>

          {!hideControls && <GridMapControls position="bottom" />}
        </Fragment>
      </TransformWrapper>
    </div>
  );
}

type GridMapControlsProps = {
  position: 'top' | 'bottom';
};

function GridMapControls({ position }: GridMapControlsProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Space.Compact size="small" className={clsx('grid-map-controls', `grid-map-controls--${position}`)}>
      <Button onClick={() => zoomIn()}>
        <ZoomInOutlined />
      </Button>
      <Button onClick={() => zoomOut()}>
        <ZoomOutOutlined />
      </Button>
      <Button onClick={() => resetTransform()}>
        <FullscreenExitOutlined />
      </Button>
    </Space.Compact>
  );
}
