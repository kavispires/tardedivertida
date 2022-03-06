import { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Space } from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// Components
import { Translate } from 'components';

type DrawingCanvasProps = {
  lines: CanvasLine[];
  setLines: CanvasSetLine;
  className?: string;
  showControls?: boolean;
  strokeWidth?: 'small' | 'medium' | 'large';
};

/**
 * Canvas drawing board using react-konva
 * @param props
 * @returns
 */
export const DrawingCanvas = ({
  lines,
  setLines,
  className = '',
  showControls = false,
  strokeWidth = 'medium',
}: DrawingCanvasProps) => {
  const [drawingHistory, setDrawingHistory] = useState<CanvasLine[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, [pos.x, pos.y]]);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add end point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = (e: any) => {
    isDrawing.current = false;
    setDrawingHistory([]);

    // Add point if it was a point
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLineEntry = lines[lines.length - 1];
    if (lastLineEntry[0] === point.x && lastLineEntry[1] === point.y) {
      // add end point
      lastLineEntry = lastLineEntry.concat([point.x + 0.1, point.y + 0.1]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLineEntry);
      setLines(lines.concat());
    }
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
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={clsx('drawing-canvas', className)}
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
