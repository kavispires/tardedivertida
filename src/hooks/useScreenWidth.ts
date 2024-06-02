import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

/**
 * Get the width of the TD content (div with id 'screen')
 */
export function useScreenWidth() {
  const { width: windowWidth } = useWindowSize();
  const [screenWidth, setScreenWidth] = useState(windowWidth);

  useEffect(() => {
    const element = document.getElementById('screen');
    if (element) {
      setScreenWidth(element.clientWidth);
    }
  }, []);

  return screenWidth;
}
