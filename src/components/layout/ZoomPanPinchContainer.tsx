import clsx from 'clsx';
import {
  type CSSProperties,
  type ComponentProps,
  type ReactNode,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
// Ant Design Resources
import {
  FullscreenExitOutlined,
  LockFilled,
  UnlockOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
// Sass
import './ZoomPanPinchContainer.scss';

export type ZoomPanPinchContainerProps = {
  /**
   * Maximum width of the container in pixels.
   */
  maxWidth: number;
  /**
   * Maximum height of the container in pixels.
   */
  maxHeight?: number;
  /**
   * Content to be rendered inside the zoomable container.
   */
  children: ReactNode;
  /**
   * Additional props to pass to the TransformWrapper component.
   */
  transformWrapperProps?: ComponentProps<typeof TransformWrapper>;
  /**
   * Whether to hide the zoom/pan controls.
   */
  hideControls?: boolean;
  /**
   * Additional CSS styles for the content.
   */
  contentStyle?: CSSProperties;
  /**
   * Additional className for the wrapper element.
   */
  wrapperClassName?: string;
  /**
   * Additional className for the content element.
   */
  contentClassName?: string;
  /**
   * Whether to lock controls on initialization.
   */
  lockControlsOnInit?: boolean;
};

/**
 * A container component that provides zoom, pan, and pinch functionality with visual feedback.
 * The container dynamically adjusts its size based on the zoom level and content dimensions.
 */
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
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const [fixedCanvasHeight, setFixedCanvasHeight] = useState<number | undefined>(maxHeight);

  const {
    initialScale = 1,
    minScale = 0.25,
    maxScale = 4,
    wheel = { step: 0.5 },
    centerOnInit = true,
    ...restTransformWrapperProps
  } = transformWrapperProps ?? {};

  /**
   * Resizes the outer container based on the current zoom level and content dimensions.
   * This function adjusts only the visual window without touching the library's internal wrapper.
   */
  const updateOuterContainerSize = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      const outer = outerContainerRef.current;
      const { instance, state } = ref;
      if (!outer || !instance.contentComponent) return;

      const contentWidth = instance.contentComponent.scrollWidth;
      const contentHeight = instance.contentComponent.scrollHeight;

      if (!maxHeight && fixedCanvasHeight !== contentHeight) {
        setFixedCanvasHeight(contentHeight);
      }

      const currentWidth = contentWidth * state.scale;
      const currentHeight = contentHeight * state.scale;

      const finalWidth = Math.min(currentWidth, maxWidth);
      const finalHeight = maxHeight ? Math.min(currentHeight, maxHeight) : currentHeight;

      outer.style.width = `${finalWidth}px`;
      outer.style.height = `${finalHeight}px`;
    },
    [maxWidth, maxHeight, fixedCanvasHeight],
  );

  return (
    <TransformWrapper
      initialScale={initialScale}
      minScale={minScale}
      maxScale={maxScale}
      wheel={wheel}
      centerOnInit={centerOnInit}
      disabled={isLocked}
      onInit={updateOuterContainerSize}
      onTransformed={updateOuterContainerSize}
      {...restTransformWrapperProps}
    >
      {!hideControls && (
        <Controls
          position="top"
          isLocked={isLocked}
          onToggleLock={() => setIsLocked(!isLocked)}
        />
      )}

      <div
        ref={outerContainerRef}
        className={clsx('zoom-pan-pinch-outer-window', wrapperClassName)}
        style={{
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          margin: '0 auto',
          transition: 'width 0.05s linear, height 0.05s linear',
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: maxWidth,
            height: fixedCanvasHeight ?? maxHeight ?? 'auto',
          }}
          contentClass={clsx('zoom-pan-pinch-content', contentClassName)}
          contentStyle={contentStyle}
        >
          <div style={{ width: 'fit-content', height: 'fit-content' }}>{children}</div>
        </TransformComponent>
      </div>

      {!hideControls && (
        <Controls
          position="bottom"
          isLocked={isLocked}
          onToggleLock={() => setIsLocked(!isLocked)}
        />
      )}
    </TransformWrapper>
  );
}

type ControlsProps = {
  /**
   * Position of the controls relative to the container.
   */
  position: 'top' | 'bottom';
  /**
   * Whether the zoom/pan controls are currently locked.
   */
  isLocked: boolean;
  /**
   * Callback function to toggle the lock state.
   */
  onToggleLock: () => void;
};

/**
 * Controls component that provides zoom in/out, reset, and lock/unlock functionality.
 */
function Controls({ position, isLocked, onToggleLock }: ControlsProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Space.Compact
      size="small"
      className={clsx('grid-map-controls', `grid-map-controls--${position}`)}
    >
      <Tooltip
        title={
          <Translate
            en="Zoom In"
            pt="Aproximar"
          />
        }
        placement={position}
      >
        <Button onClick={() => zoomIn(0.125, 0)}>
          <ZoomInOutlined />
        </Button>
      </Tooltip>

      <Tooltip
        title={
          <Translate
            en="Zoom Out"
            pt="Afastar"
          />
        }
        placement={position}
      >
        <Button onClick={() => zoomOut(0.125, 0)}>
          <ZoomOutOutlined />
        </Button>
      </Tooltip>

      <Tooltip
        title={
          <Translate
            en="Reset View"
            pt="Resetar"
          />
        }
        placement={position}
      >
        <Button onClick={() => resetTransform(0)}>
          <FullscreenExitOutlined />
        </Button>
      </Tooltip>

      <Tooltip
        title={
          isLocked ? (
            <Translate
              en="Unlock View"
              pt="Destravar Visualização"
            />
          ) : (
            <Translate
              en="Lock View"
              pt="Travar Visualização"
            />
          )
        }
        placement={position}
      >
        <Button onClick={onToggleLock}>{isLocked ? <LockFilled /> : <UnlockOutlined />}</Button>
      </Tooltip>
    </Space.Compact>
  );
}
