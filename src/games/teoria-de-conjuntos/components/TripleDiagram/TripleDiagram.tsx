import { forwardRef } from 'react';

type TripleDiagramProps = {
  width: number;
};

export const TripleDiagram = forwardRef<SVGSVGElement, TripleDiagramProps>(({ width }, ref) => {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 780" width={width}>
      <path
        fill="#007ae0"
        d="M275.35 26.64v31c112.39 0 217 85.63 218 217.53.94 122.81-105.66 218.05-218 218.05v30.45c137.24 0 248.5-111.26 248.5-248.5S412.59 26.64 275.35 26.64z"
      ></path>
      <path
        fill="#31a1ff"
        d="M275.35 26.64c-137.24 0-248.5 111.26-248.5 248.5s111.26 248.5 248.5 248.5c120.67 0 218.5-111.26 218.5-248.5S396 26.64 275.35 26.64zm0 463.55c-118.77 0-215.06-96.28-215.06-215S156.58 60.08 275.35 60.08s215 96.29 215 215.06-96.23 215.05-215 215.05z"
      ></path>
      <path d="M456.37 94.12a256 256 0 00-362 362 256 256 0 00362-362zm-181 422c-132.89 0-241-108.11-241-241s108.11-241 241-241 241 108.11 241 241-108.13 241.02-241.02 241.02z"></path>
      <path d="M275.35 49.19a226 226 0 00-146.55 54 8.64 8.64 0 1011.2 13.13 208.73 208.73 0 01135.35-49.84c115 0 208.66 93.6 208.66 208.66S390.4 483.8 275.35 483.8 66.69 390.19 66.69 275.14a208.73 208.73 0 0149.84-135.33 8.64 8.64 0 10-13.15-11.22 226 226 0 00-54 146.55c0 124.59 101.36 226 226 226s226-101.36 226-225.95-101.44-226-226.03-226z"></path>
      <path
        fill="#e0a100"
        d="M544.65 26.64v31c112.39 0 217.06 85.63 218.06 217.53C763.64 398 657 493.19 544.65 493.19v30.45c137.24 0 248.5-111.26 248.5-248.5s-111.26-248.5-248.5-248.5z"
      ></path>
      <path
        fill="#ffc531"
        d="M544.65 26.64c-137.24 0-248.5 111.26-248.5 248.5s111.26 248.5 248.5 248.5c120.68 0 218.5-111.26 218.5-248.5s-97.82-248.5-218.5-248.5zm0 463.55c-118.77 0-215-96.28-215-215s96.28-215.06 215-215.06 215.06 96.29 215.06 215.06-96.29 215-215.06 215z"
      ></path>
      <path d="M725.67 94.12a256 256 0 00-362 362 256 256 0 00362-362zm-181 422c-132.89 0-241-108.11-241-241s108.11-241 241-241 241 108.11 241 241-108.13 241.02-241.02 241.02z"></path>
      <path d="M544.65 49.19a226 226 0 00-146.55 54 8.64 8.64 0 0011.22 13.15 208.73 208.73 0 01135.33-49.86c115.06 0 208.66 93.6 208.66 208.66S659.71 483.8 544.65 483.8 336 390.19 336 275.14a208.69 208.69 0 0149.85-135.33 8.65 8.65 0 10-13.16-11.22 226 226 0 00-54 146.55c0 124.59 101.36 226 226 226s226-101.36 226-225.95-101.45-226-226.04-226z"></path>
      <path
        fill="#e0230d"
        d="M407 253.48v31c112.34-.03 217 85.6 218 217.52.94 122.79-105.66 218-218 218v30.45c137.25 0 248.5-111.26 248.5-248.5S544.2 253.48 407 253.48z"
      ></path>
      <path
        fill="#ff5440"
        d="M407 253.48c-137.24 0-248.5 111.26-248.5 248.5s111.21 248.5 248.5 248.5c120.68 0 218.5-111.26 218.5-248.5s-97.87-248.5-218.5-248.5zM407 717c-118.77 0-215-96.28-215-215s96.18-215.08 215-215.08S622 383.21 622 502s-96.27 215-215 215z"
      ></path>
      <path d="M588 321a256 256 0 1075 181 254.33 254.33 0 00-75-181zM407 743c-132.88 0-241-108.11-241-241s108.07-241 241-241 241 108.09 241 241-108.16 241-241 241z"></path>
      <path d="M407 276a226 226 0 00-146.54 54 8.64 8.64 0 1011.22 13.15A208.68 208.68 0 01407 293.32c115.06 0 208.66 93.6 208.66 208.66S522 710.64 407 710.64 198.29 617 198.29 502a208.69 208.69 0 0149.85-135.33A8.65 8.65 0 10235 355.43 226 226 0 00181 502c0 124.59 101.36 225.95 226 225.95S633 626.59 633 502 531.55 276 407 276z"></path>
    </svg>
  );
});