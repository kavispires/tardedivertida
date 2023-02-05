import { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Space } from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';

type DrawingCanvasProps = {
  /**
   * Lines drawn in the canvas
   */
  lines: CanvasLine[];
  /**
   * Function where any new version of the drawing is sent to
   */
  setLines: CanvasSetLine;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Show controls to undo, redo, or erase drawing. Default: false
   */
  showControls?: boolean;
  /**
   * Size of the stroke. Default: medium
   */
  strokeWidth?: 'small' | 'medium' | 'large';
  /**
   * The width of the canvas (default: 500)
   */
  width?: number;
  /**
   * The height of the canvas (default: 500)
   */
  height?: number;
};

/**
 * Canvas drawing board using react-konva
 * It requires an array of lines and an setState function to save the lines
 */
export const DrawingCanvas = ({
  lines,
  setLines,
  className = '',
  showControls = false,
  strokeWidth = 'medium',
  width = 500,
  height,
}: DrawingCanvasProps) => {
  const [drawingHistory, setDrawingHistory] = useState<CanvasLine[]>([]);
  const isDrawing = useRef(false);

  /**
   * Toggles off the isDrawing flag
   */
  const startDrawing = () => {
    isDrawing.current = true;
  };

  /**
   * Toggles off the isDrawing flag and resets history
   */
  const stopDrawing = () => {
    isDrawing.current = false;
    setDrawingHistory([]);
  };

  const startLine = (e: any) => {
    startDrawing();
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, [Math.round(pos.x), Math.round(pos.y)]]);
  };

  const finishLine = (e: any) => {
    // Add point if it was a point
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const x = Math.round(point.x);
    const y = Math.round(point.y);

    let lastLineEntry = lines[lines.length - 1];
    lastLineEntry = lastLineEntry.concat([x + 0.1, y + 0.1]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLineEntry);
    setLines(lines.concat());
  };

  /**
   * Start recording drawing
   * @param e - konva mouse event
   */
  const handleMouseDown = (e: any) => {
    startLine(e);
  };

  /**
   * Tracks mouse moving during the drawing
   * @param e - konva mouse event
   */
  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add end point
    lastLine = lastLine.concat([Math.round(point.x), Math.round(point.y)]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = (e: any) => {
    if (isDrawing.current) {
      stopDrawing();

      finishLine(e);
    }
  };

  /**
   * Handles case when a current drawing is stopped off stage
   * @param e - mouse event
   */
  const handleOffsetMouseUp = () => {
    stopDrawing();
  };

  /**
   * Handles case when a current drawing is started off stage
   * @param e - mouse event
   */
  const handleOffsetMouseDown = () => {
    startDrawing();
  };

  /**
   * Handles when mouse leaves the stage
   * @param e - konva mouse event
   */
  const handleMouseLeave = (e: any) => {
    if (isDrawing.current) {
      finishLine(e);

      window.document.addEventListener('mouseup', handleOffsetMouseUp);
      window.document.addEventListener('touchEnd', handleOffsetMouseUp);
      window.document.addEventListener('mousedown', handleOffsetMouseDown);
      window.document.addEventListener('touchStart', handleOffsetMouseDown);
    }
  };

  /**
   * Handles when mouse reenters the state
   * @param e
   */
  const handleMouseEnter = (e: any) => {
    if (isDrawing.current) {
      startLine(e);
    }
    window.document.removeEventListener('mouseup', handleOffsetMouseUp);
    window.document.removeEventListener('touchEnd', handleOffsetMouseUp);
    window.document.removeEventListener('mousedown', handleOffsetMouseDown);
    window.document.removeEventListener('touchStart', handleOffsetMouseDown);
  };

  const onClear = () => setLines([]);

  const onUndo = () => {
    const linesCopy = [...lines];
    const drawingHistoryCopy = [...drawingHistory];
    const lastLine: CanvasLine | undefined = linesCopy.pop();
    if (lastLine) {
      drawingHistoryCopy.push(lastLine);
      setLines(linesCopy);
      setDrawingHistory(drawingHistoryCopy);
    }
  };

  const onRedo = () => {
    const linesCopy = [...lines];
    const drawingHistoryCopy = [...drawingHistory];
    const lastUndoLine = drawingHistoryCopy.pop();
    if (lastUndoLine) {
      linesCopy.push(lastUndoLine);
      setLines(linesCopy);
      setDrawingHistory(drawingHistoryCopy);
    }
  };

  const strokeWidthBySize =
    {
      small: 3,
      medium: 5,
      large: 7,
    }?.[strokeWidth] ?? 5;

  return (
    <Space direction="vertical" align="center">
      <Stage
        width={width}
        height={height || width}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={clsx('drawing-canvas', className)}
        style={{ width: `${width}px`, height: `${height || width}px` }}
        id="drawing-canvas"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line}
              stroke="#222222"
              strokeWidth={strokeWidthBySize}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
      {showControls && (
        <Space>
          <Button onClick={onUndo} disabled={lines.length === 0}>
            <UndoOutlined />
            <Translate pt="Desfazer" en="Undo" />
          </Button>
          <Button onClick={onRedo} disabled={drawingHistory.length === 0}>
            <UndoOutlined />
            <Translate pt="Refazer" en="Redo" />
          </Button>
          <Button onClick={onClear} disabled={lines.length === 0}>
            <DeleteOutlined />
            <Translate pt="Apagar" en="Clear" />
          </Button>
        </Space>
      )}
    </Space>
  );
};
