import type React from 'react';

export function WarningSignBackgroundMask(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      {...props}
    >
      <rect
        width="370"
        height="370"
        x="64.2"
        y="64.2"
        fill="#fbb903"
        rx="30"
        ry="30"
        transform="rotate(45 249.198 249.201)"
      ></rect>
      <rect
        width="338"
        height="338"
        x="80.2"
        y="80.2"
        fill="none"
        stroke="#000"
        strokeMiterlimit="10"
        strokeWidth="6"
        rx="15"
        ry="15"
        transform="rotate(45 249.198 249.201)"
      ></rect>
    </svg>
  );
}
