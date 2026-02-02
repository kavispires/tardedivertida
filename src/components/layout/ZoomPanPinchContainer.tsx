import clsx from 'clsx';
import { type CSSProperties, Fragment, type ComponentProps, type ReactNode, useState } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
// Ant Design Resources
import {
  FullscreenExitOutlined,
  LockFilled,
  UnlockOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
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
  lockControlsOnInit?: boolean;
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
  lockControlsOnInit = false,
}: ZoomPanPinchContainerProps) {
  const [isLocked, setIsLocked] = useState(lockControlsOnInit);

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
      // 2. Pass the locked state to the disabled prop
      disabled={isLocked}
      {...restTransformWrapperProps}
    >
      <Fragment>
        {/* 3. Pass state and toggle handler to Controls */}
        {!hideControls && (
          <Controls
            position="top"
            isLocked={isLocked}
            onToggleLock={() => setIsLocked(!isLocked)}
          />
        )}

        <TransformComponent
          wrapperClass={clsx('zoom-pan-pinch-wrapper', wrapperClassName)}
          wrapperStyle={{ maxWidth, maxHeight }}
          contentClass={clsx('zoom-pan-pinch-content', contentClassName)}
          contentStyle={contentStyle}
        >
          <div style={{ maxWidth, maxHeight }}>{children}</div>
        </TransformComponent>

        {!hideControls && (
          <Controls
            position="bottom"
            isLocked={isLocked}
            onToggleLock={() => setIsLocked(!isLocked)}
          />
        )}
      </Fragment>
    </TransformWrapper>
  );
}

type ControlsProps = {
  position: 'top' | 'bottom';
  isLocked: boolean;
  onToggleLock: () => void;
};

function Controls({ position, isLocked, onToggleLock }: ControlsProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Space.Compact
      size="small"
      className={clsx('zoom-pan-pinch-controls', `zoom-pan-pinch-controls--${position}`)}
    >
      {/* Optional: You can disable zoom buttons when locked by adding
         disabled={isLocked} to these buttons if desired.
      */}
      <Button
        onClick={() => zoomIn()}
        title="Zoom In"
      >
        <ZoomInOutlined />
      </Button>
      <Button
        onClick={() => zoomOut()}
        title="Zoom Out"
      >
        <ZoomOutOutlined />
      </Button>
      <Button onClick={() => resetTransform()}>
        <FullscreenExitOutlined />
      </Button>

      {/* 4. Update the Lock button to toggle and show status */}
      <Button
        onClick={onToggleLock}
        title={isLocked ? 'Unlock View' : 'Lock View'}
      >
        {isLocked ? <LockFilled /> : <UnlockOutlined />}
      </Button>
    </Space.Compact>
  );
}
