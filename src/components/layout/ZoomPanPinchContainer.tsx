import clsx from 'clsx';
import { type CSSProperties, Fragment, type ComponentProps, type ReactNode } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
// Ant Design Resources
import { FullscreenExitOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Sass
import './ZoomPanPinchContainer.scss';

type ZoomPanPinchContainerProps = {
  maxWidth: number;
  maxHeight?: number | 'auto';
  children: ReactNode;
  transformWrapperProps?: ComponentProps<typeof TransformWrapper>;
  hideControls?: boolean;
  contentStyle?: CSSProperties;
  wrapperClassName?: string;
  contentClassName?: string;
};

export function ZoomPanPinchContainer({
  maxWidth,
  maxHeight,
  children,
  transformWrapperProps,
  hideControls = false,
  contentStyle = {},
  wrapperClassName,
  contentClassName,
}: ZoomPanPinchContainerProps) {
  const {
    initialScale = 1,
    minScale = 0.25,
    maxScale = 4,
    wheel = { step: 0.5 },
    centerOnInit = true,
    ...restTransformWrapperProps
  } = transformWrapperProps ?? {};

  return (
    <TransformWrapper
      initialScale={initialScale}
      minScale={minScale}
      maxScale={maxScale}
      wheel={wheel}
      centerOnInit={centerOnInit}
      {...restTransformWrapperProps}
    >
      <Fragment>
        {!hideControls && <Controls position="top" />}

        <TransformComponent
          wrapperClass={clsx('zoom-pan-pinch-wrapper', wrapperClassName)}
          wrapperStyle={{ maxWidth, maxHeight }}
          contentClass={clsx('zoom-pan-pinch-content', contentClassName)}
          contentStyle={contentStyle}
        >
          <div style={{ maxWidth, maxHeight }}>{children}</div>
        </TransformComponent>
        {!hideControls && <Controls position="bottom" />}
      </Fragment>
    </TransformWrapper>
  );
}

type ControlsProps = {
  position: 'top' | 'bottom';
};

function Controls({ position }: ControlsProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Space.Compact
      size="small"
      className={clsx('zoom-pan-pinch-controls', `zoom-pan-pinch-controls--${position}`)}
    >
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
