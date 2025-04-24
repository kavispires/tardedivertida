import clsx from 'clsx';
import { Stage, Layer, Line } from 'react-konva';
// Sass
import './Canvas.scss';

type CanvasProps = {
  drawing?: string | CanvasLine[];
  /**
   * Optional custom class name
   */
  className?: string;
};

/**
 *
 * @param props
 * @returns
 */
export const Canvas = ({ drawing = '[]', className = '' }: CanvasProps) => {
  const lines = typeof drawing === 'string' ? JSON.parse(drawing) : drawing;

  return (
    <Stage width={500} height={500} className={clsx('canvas', className)}>
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
