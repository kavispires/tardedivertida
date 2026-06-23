import clsx from 'clsx';
import type { KonvaEventObject } from 'konva/lib/Node';
import { type CSSProperties, type ReactNode, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
// Ant Design Resources
import {
  DeleteOutlined,
  UndoOutlined,
  HighlightOutlined,
  CloseCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Button, Flex, Space } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
// Sass
import styles from './DrawingCanvas.module.scss';

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
  /**
   * If the canvas will be read frequently, it will be rendered in a different way
   */
  willReadFrequently?: boolean;
  /**
   * Custom style for the canvas
   */
  style?: CSSProperties;
  /**
   * A mask to be used under the canvas. Requires changing canvas to be transparent and setting the mask to have an absolute position
   */
  mask?: ReactNode;
};

/**
 * Calculates the shortest distance from a point to a line segment
 */
const getDistanceToSegment = (
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number },
) => {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.sqrt((p.x - v.x) ** 2 + (p.y - v.y) ** 2);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = v.x + t * (w.x - v.x);
  const projY = v.y + t * (w.y - v.y);
  return Math.sqrt((p.x - projX) ** 2 + (p.y - projY) ** 2);
};

/**
 * Canvas drawing board using react-konva with pen and eraser tools.
 * Requires an array of lines and a setState function to save the lines.
 * The eraser tool splits lines when erasing portions, maintaining chronological drawing order.
 */
export const DrawingCanvas = ({
  lines,
  setLines,
  className = '',
  showControls = false,
  strokeWidth = 'medium',
  width = 500,
  height,
  willReadFrequently = false,
  style = {},
  mask,
}: DrawingCanvasProps) => {
  // Snapshot history to correctly undo erasures and splits
  const [history, setHistory] = useState<CanvasLine[][]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const isDrawing = useRef(false);

  const strokeWidthBySize =
    {
      small: 3,
      medium: 5,
      large: 7,
    }?.[strokeWidth] ?? 5;

  const eraserRadius = strokeWidthBySize * 3; // Make eraser slightly larger than pen

  /**
   * Saves a snapshot of the current drawing state to the history for undo/redo
   */
  const saveHistorySnapshot = (newLines: CanvasLine[]) => {
    const nextHistory = history.slice(0, historyStep + 1);
    nextHistory.push([...newLines]);
    setHistory(nextHistory);
    setHistoryStep(nextHistory.length - 1);
  };

  /**
   * Starts a drawing action and initializes history if needed
   */
  const startDrawing = () => {
    isDrawing.current = true;
    // Save current state as base for this action
    if (history.length === 0) {
      setHistory([[...lines]]);
      setHistoryStep(0);
    }
  };

  /**
   * Stops the current drawing action and saves the state to history
   */
  const stopDrawing = () => {
    isDrawing.current = false;
    saveHistorySnapshot(lines);
  };

  /**
   * Erases portions of lines at the given coordinates by splitting them into segments
   */
  const eraseAt = (ex: number, ey: number) => {
    setLines(
      lines.reduce<CanvasLine[]>((acc, line) => {
        let currentSegment: CanvasLine = [];

        for (let j = 0; j < line.length; j += 2) {
          const x = line[j];
          const y = line[j + 1];

          let isErased = false;

          if (j >= 2) {
            const prevX = line[j - 2];
            const prevY = line[j - 1];
            // Check distance from eraser to line segment
            const dist = getDistanceToSegment({ x: ex, y: ey }, { x: prevX, y: prevY }, { x, y });
            if (dist <= eraserRadius) isErased = true;
          } else {
            // Check single point distance
            const dist = Math.sqrt((x - ex) ** 2 + (y - ey) ** 2);
            if (dist <= eraserRadius) isErased = true;
          }

          if (isErased) {
            // If we hit an erased point, wrap up the current segment (needs at least 2 points / 4 coordinates)
            if (currentSegment.length >= 4) {
              acc.push(currentSegment);
            }
            currentSegment = [];
          } else {
            currentSegment.push(x, y);
          }
        }

        if (currentSegment.length >= 4) {
          acc.push(currentSegment);
        }

        return acc;
      }, []),
    );
  };

  /**
   * Handles mouse down event to start drawing or erasing
   */
  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    startDrawing();
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);

    if (tool === 'pen') {
      setLines([...lines, [x, y]]);
    } else {
      eraseAt(x, y);
    }
  };

  /**
   * Handles mouse move event to continue drawing or erasing
   */
  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);

    if (tool === 'pen') {
      const newLines = [...lines];
      let lastLine = newLines[newLines.length - 1] || [];
      lastLine = lastLine.concat([x, y]);
      newLines[newLines.length - 1] = lastLine;
      setLines(newLines);
    } else {
      eraseAt(x, y);
    }
  };

  /**
   * Handles mouse up event to stop drawing or erasing
   */
  const handleMouseUp = () => {
    if (isDrawing.current) {
      stopDrawing();
    }
  };

  /**
   * Handles mouse leave event to stop drawing or erasing when cursor leaves canvas
   */
  const handleMouseLeave = () => {
    if (isDrawing.current) {
      stopDrawing();
    }
  };

  /**
   * Clears all lines from the canvas and saves to history
   */
  const onClear = () => {
    saveHistorySnapshot([]);
    setLines([]);
  };

  /**
   * Undoes the last drawing action
   */
  const onUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      setLines([...history[prevStep]]);
    }
  };

  /**
   * Redoes the previously undone drawing action
   */
  const onRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      setLines([...history[nextStep]]);
    }
  };

  return (
    <Flex
      vertical
      align="center"
      className="relative"
    >
      {mask}
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
        className={clsx(styles.drawingCanvas, className)}
        style={{
          width: `${width}px`,
          height: `${height || width}px`,
          ...style,
          cursor: tool === 'eraser' ? 'crosshair' : 'default',
        }}
        willReadFrequently={willReadFrequently}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i} // Safer to use index here since lines arrays are constantly mutating
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
        <Space
          className="mt-2"
          size="small"
          wrap
        >
          {/* Tool Selection */}
          <Space.Compact>
            <Button
              onClick={() => setTool('pen')}
              icon={<HighlightOutlined />}
              type={tool === 'pen' ? 'primary' : 'default'}
            >
              {tool !== 'pen' && (
                <Translate
                  pt="Caneta"
                  en="Pen"
                />
              )}
            </Button>
            <Button
              onClick={() => setTool('eraser')}
              icon={<CloseCircleOutlined />}
              type={tool === 'eraser' ? 'primary' : 'default'}
            >
              {tool !== 'eraser' && (
                <Translate
                  pt="Borracha"
                  en="Eraser"
                />
              )}
            </Button>
          </Space.Compact>

          {/* Action Controls */}
          <Space.Compact>
            <Button
              onClick={onUndo}
              disabled={historyStep === 0 || history.length === 0}
              icon={<UndoOutlined />}
            >
              <Translate
                pt="Desfazer"
                en="Undo"
              />
            </Button>
            <Button
              onClick={onRedo}
              disabled={historyStep === history.length - 1}
              icon={<RedoOutlined />}
            >
              <Translate
                pt="Refazer"
                en="Redo"
              />
            </Button>
          </Space.Compact>
          <Button
            onClick={onClear}
            disabled={lines.length === 0}
          >
            <DeleteOutlined />
            <Translate
              pt="Apagar"
              en="Clear"
            />
          </Button>
        </Space>
      )}
    </Flex>
  );
};
