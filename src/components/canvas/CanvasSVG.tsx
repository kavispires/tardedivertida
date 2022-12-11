/**
 * Builds paths from canvas lines
 * @param lines
 * @returns
 */
const getPathFromKonvaLines = (lines: CanvasLine[]) => {
  const result = lines.map((lineArr) => {
    let path = '';
    for (let x = 0, y = 1; y < lineArr.length; x += 2, y += 2) {
      if (lineArr[x + 2] && lineArr[y + 2]) {
        path += `M${lineArr[x]},${lineArr[y]} L${lineArr[x + 2]},${lineArr[y + 2]}`;
      }
    }

    return path;
  });

  return result;
};

type CanvasSVGProps = {
  /**
   * The stringified svg path
   */
  drawing: string;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Size in px of width and height (square)
   */
  size?: number;
};

export const CanvasSVG = ({ drawing = '', className = '', size = 250 }: CanvasSVGProps) => {
  const konvaLines = JSON.parse(drawing);
  const paths = getPathFromKonvaLines(konvaLines);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      overflow="hidden"
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <defs />
      {paths.map((path, index) => (
        <path
          key={`${drawing}-${index}`}
          d={path}
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
      ))}
    </svg>
  );
};
