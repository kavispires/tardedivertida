import { useEffect, useState } from 'react';

export type SlideShowConfig = {
  /**
   * The total number of slides
   */
  length: number;
  /**
   * The duration of each slide
   */
  slideDuration?: number;
  /**
   * The index of the current slide
   * @default 0
   **/
  slideIndex: number;
  /**
   * Set the index of the current slide
   */
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  /**
   * Flag to indicate if this is the first run through of the gallery
   */
  isFirstGalleryRunThrough: boolean;
  /**
   * Set the flag to indicate if this is the first run through of the gallery
   */
  setIsFirstGalleryRunThrough: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Callback function to execute when the slide show expires
   */
  onExpire: () => void;
};

/**
 * Controls slide show
 * @param length
 */
export function useSlideShow(options: {
  length: number;
  slideDuration: number;
  onExpire: () => void;
}): SlideShowConfig {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFirstGalleryRunThrough, setIsFirstGalleryRunThrough] = useState(true);

  useEffect(() => {
    if (isFirstGalleryRunThrough && slideIndex === options.length - 1) {
      setIsFirstGalleryRunThrough(false);
    }
  }, [isFirstGalleryRunThrough, slideIndex, options.length]);

  return {
    ...options,
    slideIndex,
    setSlideIndex,
    isFirstGalleryRunThrough,
    setIsFirstGalleryRunThrough,
  };
}
