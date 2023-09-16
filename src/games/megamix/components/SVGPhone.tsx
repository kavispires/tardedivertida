import { ReactNode } from 'react';

type SVGPhoneProps = {
  children: ReactNode;
};

export function SVGPhone({ children }: SVGPhoneProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 453.03 800" className="svg-phone">
      <path d="M394.81 0H58.21A58.22 58.22 0 000 58.28v683.5A58.19 58.19 0 0058.21 800h336.6a58.23 58.23 0 0058.21-58.22V58.28A58.26 58.26 0 00394.81 0zM143.45 35.39h166.17c4.2 0 7.61 6.27 7.61 14s-3.41 14.05-7.61 14.05H143.45c-4.22 0-7.57-6.29-7.57-14.05s3.35-14 7.57-14zm83.06 707.09a37.17 37.17 0 1137.11-37.2 37.22 37.22 0 01-37.11 37.2zm182.9-127.36H43.64V98.33h365.77v516.79z"></path>
      <foreignObject x="43" y="98" width="365" height="516">
        {children}
      </foreignObject>
    </svg>
  );
}
