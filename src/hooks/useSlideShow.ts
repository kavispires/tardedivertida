import { useEffect, useState } from 'react';

/**
 * Controls slide show
 * @param length
 */
export function useSlideShow(length: number): {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  isFirstGalleryRunThrough: boolean;
  setIsFirstGalleryRunThrough: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirstGalleryRunThrough, setIsFirstGalleryRunThrough] = useState(true);

  useEffect(() => {
    if (isFirstGalleryRunThrough && activeIndex === length - 1) {
      setIsFirstGalleryRunThrough(false);
    }
  }, [isFirstGalleryRunThrough, activeIndex, length]);

  return {
    activeIndex,
    setActiveIndex,
    isFirstGalleryRunThrough,
    setIsFirstGalleryRunThrough,
  };
}
