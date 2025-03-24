import { forwardRef } from 'react';
// Internal
import { HoverablePath } from '../HoverableAreas';
// Internal

type DoubleDiagramClickableAreasProps = {
  width: number;
  onClick: (areaKey: string) => void;
};

export const DoubleDiagramClickableAreas = forwardRef<SVGSVGElement, DoubleDiagramClickableAreasProps>(
  ({ width, onClick }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 820 648"
        width={width}
        className="clickable-areas"
      >
        {/* A */}
        <HoverablePath
          areaKey="A"
          onClick={onClick}
          fill="#31a1ff"
          d="M292 324c0-84.5 40.8-159.5 103.8-206.3a241 241 0 1 0 0 412.6A256.4 256.4 0 0 1 292 324Z"
        />
        {/* AW */}
        <HoverablePath
          areaKey="AW"
          onClick={onClick}
          fill="#71b371"
          d="M512.2 324c0-81.4-40.4-153.4-102.2-197a240.7 240.7 0 0 0 0 394 240.7 240.7 0 0 0 102.2-197Z"
        />
        {/* W */}
        <HoverablePath
          areaKey="W"
          onClick={onClick}
          fill="#ffc531"
          d="M528 324c0 84.5-40.8 159.5-103.8 206.3a241 241 0 1 0 0-412.6A256.4 256.4 0 0 1 528 324Z"
        />

        {/* O */}
        <HoverablePath
          areaKey="O"
          onClick={onClick}
          fill="#fff"
          d="M0 0v648h820V0H0Zm548.8 580.8c-51.1 0-98.8-15-138.8-40.7a256.8 256.8 0 1 1 0-432.2 256.8 256.8 0 1 1 138.8 473Z"
        />
      </svg>
    );
  },
);
