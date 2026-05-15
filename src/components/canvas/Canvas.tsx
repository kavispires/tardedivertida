import clsx from 'clsx';
import { Stage, Layer, Line } from 'react-konva';
// Sass
import styles from './Canvas.module.scss';

type CanvasProps = {
  /**
   * The drawing data (JSON string or array of canvas lines)
   */
  drawing?: string | CanvasLine[];
  /**
   * Optional custom class name
   */
  className?: string;
};

/**
 * Renders a Konva canvas displaying drawing data from JSON or array of canvas lines
 */
export const Canvas = ({ drawing = '[]', className = '' }: CanvasProps) => {
  const lines = typeof drawing === 'string' ? JSON.parse(drawing) : drawing;

  return (
    <Stage
      width={500}
      height={500}
      className={clsx(styles.canvas, className)}
    >
      <Layer>
        {lines.map((line: CanvasLine, i: number) => (
          <Line
            key={i}
            points={line}
            stroke="#222222"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
};
