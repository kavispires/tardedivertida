import { forwardRef } from 'react';

type DoubleDiagramProps = {
  width: number;
};

export const DoubleDiagram = forwardRef<SVGSVGElement, DoubleDiagramProps>(({ width }, ref) => {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 648" width={width}>
      <path
        fill="#31a1ff"
        stroke="#000"
        stroke-miterlimit="10"
        stroke-width="6"
        d="M271.2 67.2a256.8 256.8 0 1 0 0 513.6 256.8 256.8 0 0 0 0-513.6Zm0 497.8a241 241 0 1 1 0-482 241 241 0 0 1 0 482Z"
      />
      <path
        fill="#ffc531"
        stroke="#000"
        stroke-miterlimit="10"
        stroke-width="6"
        d="M548.8 67.2a256.8 256.8 0 1 0 0 513.6 256.8 256.8 0 0 0 0-513.6Zm0 497.8a241 241 0 1 1 0-482 241 241 0 0 1 0 482Z"
      />
    </svg>
  );
});
