import { useEffect } from 'react';

/**
 * Injects class to change image-preview css
 * @param activate
 */
export function useDancingDoors(activate: boolean) {
  useEffect(() => {
    if (activate) {
      document.body.classList.add('image-preview-dancing');
    }

    return () => document.body.classList.remove('image-preview-dancing');
  }, [activate]);
}
