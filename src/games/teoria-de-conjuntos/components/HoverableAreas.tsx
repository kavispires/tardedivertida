/** biome-ignore-all lint/a11y/noStaticElementInteractions: interactive svg */
import { useState } from 'react';

type HoverablePathProps = {
  d: string;
  fill: string;
  areaKey: string;
  onClick: (areaKey: string) => void;
};

export function HoverablePath({ d, fill, onClick, areaKey }: HoverablePathProps) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <path
      id={`area-key-${areaKey}`}
      fill={isHovered ? '#FFF' : fill}
      d={d}
      opacity={isHovered ? '0.5' : '0.25'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      cursor="pointer"
      onClick={() => onClick(areaKey)}
    />
  );
}
