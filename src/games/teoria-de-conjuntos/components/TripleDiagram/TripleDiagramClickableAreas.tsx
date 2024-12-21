import { forwardRef } from 'react';
// Internal
import { HoverablePath } from './HoverableAreas';

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
          d="M116.53 139.81a208.54 208.54 0 0040.36 307 257.08 257.08 0 01131.77-172 254.31 254.31 0 0175-180.71c1.81-1.81 3.66-3.59 5.51-5.34A208.55 208.55 0 00140 116.32a8.63 8.63 0 01-10.36.64q-6.5 6-12.49 12.49a8.62 8.62 0 01-.62 10.36z"
        />
        {/* AW */}
        <HoverablePath
          areaKey="AW"
          onClick={onClick}
          fill="#71b371"
          d="M385.84 139.81a208.66 208.66 0 0 0-48.93 115.83 258.62 258.62 0 0 1 146.35 1.86 208.43 208.43 0 0 0-73.33-141.68l-.61.5A8.62 8.62 0 0 1 399 117q-6.49 6-12.48 12.49a8.65 8.65 0 0 1-.68 10.32Z"
        />
        {/* W */}
        <HoverablePath
          areaKey="W"
          onClick={onClick}
          fill="#ffc531"
          d="M531.35 275.14v3A257 257 0 0 1 588 321a254.15 254.15 0 0 1 69.8 129.43 208.64 208.64 0 0 0 95.54-175.25c0-115.06-93.6-208.66-208.66-208.66a208.8 208.8 0 0 0-93.81 22.29c1.86 1.75 3.71 3.53 5.53 5.35a254.33 254.33 0 0 1 74.95 180.98Z"
        />
        {/* WC */}
        <HoverablePath
          areaKey="WC"
          onClick={onClick}
          fill="#ff8d39"
          d="M525.41 330.3a254.32 254.32 0 0 1-69 125.86 276.17 276.17 0 0 1-5.51 5.33 208.42 208.42 0 0 0 162.61 10.63 208.94 208.94 0 0 0-88.1-141.82Z"
        />
        {/* C */}
        <HoverablePath
          areaKey="C"
          onClick={onClick}
          fill="#ff5440"
          d="M410 493a257.19 257.19 0 0 1-210.95 26.66c9 106.83 98.79 191 207.9 191 108.49 0 197.88-83.22 207.75-189.16a257.32 257.32 0 0 1-70.05 9.66A254.39 254.39 0 0 1 410 493Z"
        />
        {/* AC */}
        <HoverablePath
          areaKey="AC"
          onClick={onClick}
          fill="#9360a0"
          d="M369.14 461.49c-1.85-1.75-3.7-3.52-5.51-5.33a254.18 254.18 0 0 1-69.81-129.5 208.07 208.07 0 0 0-22.19 16.5 8.63 8.63 0 0 1-10.36.64q-6.49 6-12.49 12.49a8.65 8.65 0 0 1-.64 10.36A208.7 208.7 0 0 0 200.76 470a208.44 208.44 0 0 0 168.38-8.52Z"
        />
        {/* AWC */}
        <HoverablePath
          areaKey="AWC"
          onClick={onClick}
          fill="#b09e95"
          d="M410 434.4a208.64 208.64 0 0 0 71.56-127.28A208.48 208.48 0 0 0 338.14 305 208.59 208.59 0 0 0 410 434.4Z"
        />

        {/* O */}
        <HoverablePath
          areaKey="O"
          onClick={onClick}
          fill="#fff"
          d="M0 0v780h820V0Zm725.67 456.16A256.75 256.75 0 0 1 663 502.29a256 256 0 0 1-512-.29v-3a257.25 257.25 0 0 1-56.66-42.86A256.06 256.06 0 0 1 410 57.32a256 256 0 0 1 315.67 398.84Z"
        />

        {/* Fake contain items */}
      </svg>
    );
  },
);
