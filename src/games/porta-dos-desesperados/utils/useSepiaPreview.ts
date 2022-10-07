import { useEffect } from 'react';

/**
 * Injects class to change image-preview css
 * @param activate
 */
export function useSepiaPreview(activate: boolean) {
  useEffect(() => {
    if (activate) {
      document.body.classList.add('image-preview-sepia');
    }

    return () => document.body.classList.remove('image-preview-sepia');
  }, [activate]);
}
