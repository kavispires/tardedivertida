import { forwardRef } from 'react';
// Internal
import { HoverablePath } from '../HoverableAreas';

type TripleDiagramClickableAreasProps = {
  width: number;
  onClick: (areaKey: string) => void;
};

export const TripleDiagramClickableAreas = forwardRef<SVGSVGElement, TripleDiagramClickableAreasProps>(
  ({ width, onClick }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 820 780"
        width={width}
        className="clickable-areas"
      >
        {/* A */}
        <HoverablePath
          areaKey="A"
          onClick={onClick}
          fill="#31a1ff"
          d="M289 271.6A258 258 0 0 1 390.5 70a236.6 236.6 0 0 0-119.3-32c-63.6 0-123.3 24.8-168.3 69.8S33.2 212.5 33.2 276 58 399.4 102.9 444.3a239.6 239.6 0 0 0 44.1 34.9 260.2 260.2 0 0 1 142-207.6Z"
        />
        {/* AW */}
        <HoverablePath
          areaKey="AW"
          onClick={onClick}
          fill="#71b371"
          d="M311.3 261.7a259.7 259.7 0 0 1 94.4-17.6c36 0 71 7.3 103.2 21.3a236.3 236.3 0 0 0-99-182.7 236.3 236.3 0 0 0-98.8 179Z"
        />
        {/* W */}
        <HoverablePath
          areaKey="W"
          onClick={onClick}
          fill="#ffc531"
          d="M548.8 38c-42.6 0-83.4 11.2-119.3 32A258 258 0 0 1 531 276v.2A261 261 0 0 1 664.8 484a239.2 239.2 0 0 0 122-208c0-63.5-24.7-123.3-69.7-168.2-45-45-104.7-69.7-168.3-69.7Z"
        />
        {/* WC */}
        <HoverablePath
          areaKey="WC"
          onClick={onClick}
          fill="#ff8d39"
          d="M529.9 300.8a257.8 257.8 0 0 1-100.4 181.3c35.9 20.8 76.7 32 119.3 32 33.1 0 65.2-6.8 94.7-19.6A236.3 236.3 0 0 0 574 335.6a239.7 239.7 0 0 0-44.2-34.8Z"
        />
        {/* C */}
        <HoverablePath
          areaKey="C"
          onClick={onClick}
          fill="#ff5440"
          d="M410 495.8a258.1 258.1 0 0 1-138.8 40c-36.1 0-71.1-7.2-103.3-21.2 2.6 59.6 27 115.2 69.5 157.6 45 45 104.7 69.7 168.3 69.7S529 717.2 574 672.2a236.3 236.3 0 0 0 69.2-154 259.7 259.7 0 0 1-94.4 17.7c-49.9 0-97.7-14-138.8-40.1Z"
        />
        {/* AC */}
        <HoverablePath
          areaKey="AC"
          onClick={onClick}
          fill="#9360a0"
          d="M289.7 296a239.2 239.2 0 0 0-121.6 194.7A237 237 0 0 0 271 514c42.7 0 83.5-11.2 119.4-32A258 258 0 0 1 289.8 296Z"
        />
        {/* AWC */}
        <HoverablePath
          areaKey="AWC"
          onClick={onClick}
          fill="#b09e95"
          d="M439.5 444.4a236.2 236.2 0 0 0 69.3-155A237 237 0 0 0 405.7 266c-33.1 0-65.2 6.7-94.7 19.5a236.3 236.3 0 0 0 99 184 241.6 241.6 0 0 0 29.5-25.1Z"
        />

        {/* O */}
        <HoverablePath
          areaKey="O"
          onClick={onClick}
          fill="#fff"
          d="M0 0v780h820V0H0Zm732.5 459.8c-20 20-42.6 36.2-67 48.6-1.2 67.7-28 131.2-76 179.3s-114.4 76-183.8 76-134.7-27-183.8-76c-49-49.1-76-114.4-76-183.8v-.1A261 261 0 0 1 11.2 276c0-69.4 27-134.6 76.1-183.7a258 258 0 0 1 183.8-76c49.9 0 97.6 13.9 138.8 40 41.1-26.1 88.9-40 138.8-40 69.4 0 134.7 27 183.7 76 49.1 49 76.1 114.3 76.1 183.7s-27 134.7-76 183.8Z"
        />
      </svg>
    );
  },
);
