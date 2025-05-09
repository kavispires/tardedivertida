import type { ReactNode } from 'react';

type BookProps = {
  children?: [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
};

export function Book({ children }: BookProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 725.95 328.66"
      style={{ width: '50vw', maxWidth: '600px' }}
    >
      <defs>
        <linearGradient id="a" x1="171.8" x2="354.26" y1="170.82" y2="170.82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9d9d9"></stop>
          <stop offset="1" stopColor="#fff"></stop>
        </linearGradient>
        <linearGradient
          id="b"
          x1="371.69"
          x2="554.14"
          y1="171.43"
          y2="171.43"
          xlinkHref="#a"
        ></linearGradient>
        <linearGradient
          id="c"
          x1="554.14"
          x2="725.95"
          y1="178.59"
          y2="178.59"
          xlinkHref="#a"
        ></linearGradient>
      </defs>
      <path
        fill="#6770b3"
        d="M363 40.45S313.41-5.8 263.85 25.89 158.73 44.64 158.73 44.64v284L363 314.34z"
      ></path>
      <path
        fill="#6770b3"
        d="M363 40.45S313.41-5.8 263.85 25.89 158.73 44.64 158.73 44.64v284L363 314.34z"
      ></path>
      <path
        fill="#b3b3b3"
        d="M222.05 310.18c-4.7.87-9 1.56-13 2.11l-1.9.3 147.09-10.1s-51.52-4.77-132.19 7.69z"
      ></path>
      <path
        fill="#ccc"
        d="M245.56 305.05a407.52 407.52 0 01-23.48 5.12c80.67-12.46 132.21-7.69 132.21-7.69s-51.24-10.58-108.73 2.57z"
      ></path>
      <path
        fill="#e6e6e6"
        d="M327.62 295a134.29 134.29 0 00-59.08 3.85q-12.45 3.65-23 6.24c57.49-13.15 108.7-2.56 108.7-2.56s-10.07-4.92-26.62-7.53z"
      ></path>
      <path
        fill="#fff"
        d="M260.85 39.84C226.27 59.2 171.8 61.07 171.8 61.07v251.75s6.95 2.31 25.52.78c2.74-.22 5.74-.53 9-1l2.77-.36q6.6-1.14 13-2.11c6.95-1.29 14.75-3 23.48-5.12q10.58-2.61 23-6.24a134.29 134.29 0 0159.05-3.77c16.55 2.64 26.64 7.52 26.64 7.52V49.84c-38.67-25.84-58.82-29.37-93.41-10z"
      ></path>
      <path
        fill="#6770b3"
        d="M363 40.45s47.59-38.77 99.1-18.56c54.76 21.48 105.12 22.75 105.12 22.75v284L363 314.34z"
      ></path>
      <path
        fill="#6770b3"
        d="M363 40.45s47.59-38.77 99.1-18.56c54.76 21.48 105.12 22.75 105.12 22.75v284L363 314.34z"
      ></path>
      <path
        fill="#b3b3b3"
        d="M503.9 310.18c4.7.87 9 1.56 13 2.11l1.9.3-147.09-10.1s51.52-4.77 132.19 7.69z"
      ></path>
      <path
        fill="#ccc"
        d="M480.39 305.05a407.52 407.52 0 0023.48 5.12c-80.67-12.46-132.21-7.69-132.21-7.69s51.24-10.58 108.73 2.57z"
      ></path>
      <path
        fill="#e6e6e6"
        d="M398.33 295a134.3 134.3 0 0159.08 3.85q12.45 3.65 23 6.24c-57.49-13.15-108.7-2.56-108.7-2.56s10.06-4.92 26.62-7.53z"
      ></path>
      <path
        fill="#fff"
        d="M465.1 37.84c37.28 13.46 89 23.23 89 23.23v251.75s-6.94 2.31-25.51.78c-2.74-.22-5.74-.53-9-1l-2.77-.36q-6.6-1.14-13-2.11a444.4 444.4 0 01-23.48-5.12q-10.57-2.61-23-6.24a134.3 134.3 0 00-59.01-3.77c-16.56 2.64-26.64 7.52-26.64 7.52V49.84c38.67-25.84 55.86-25.56 93.41-12z"
      ></path>

      <foreignObject x="185" y="63" width="150" height="225">
        {children?.[0]}
      </foreignObject>

      <foreignObject x="387" y="63" width="150" height="225">
        {children?.[1]}
      </foreignObject>

      {!!children?.[2] && (
        <path fill="#fff" d="M554.14 61.53s69.5-28 171.81-12v251.06s-117-6.94-171.81 12z"></path>
      )}

      <foreignObject x="566" y="63" width="150" height="225">
        {!!children?.[2] && children[2]}
      </foreignObject>
    </svg>
  );
}
