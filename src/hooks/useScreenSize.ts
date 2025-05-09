import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

/**
 * Get the width of the TD content (div with id 'screen')
 */
export function useScreenSize() {
  const windowSizes = useWindowSize({ initialWidth: 300, initialHeight: 300 });
  const [sizes, setScreenSize] = useState(windowSizes);

  useEffect(() => {
    const element = document.getElementById('screen');
    if (element) {
      setScreenSize({
        width: Math.min(element.clientWidth, windowSizes.width),
        height: Math.min(element.clientHeight, windowSizes.height),
      });
    }
  }, [windowSizes.width, windowSizes.height]);

  return [sizes.width, sizes.height];
}
