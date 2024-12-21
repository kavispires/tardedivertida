import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import type { ButtonProps } from 'antd';
// Hooks
import type { SlideShowConfig } from 'hooks/useSlideShow';
// Internal
import { SlideShowControls } from './SlideShowControls';

type SlideShowProps = {
  /**
   * Slide show configuration provided by useSlideShow
   */
  config: SlideShowConfig;
  /**
   * The left and right active pages of the slide
   */
  children: [ReactNode, ReactNode];
  /**
   * The color of the progress bar (default: gray)
   */
  barColor: string;
  /**
   * Prop indicating if the controls should be disabled
   */
  disableControls?: boolean;
  /**
   * Optional class name for the wrapper
   */
  className?: string;
  /**
   * Optional class name for the left page
   */
  leftClassName?: string;
  /**
   * Optional class name for the right page
   */
  rightClassName?: string;
  /**
   * Next Button props (See Ranking Button)
   */
  nextButtonProps?: ButtonProps;
};

/**
 * Display Slick show with a left and right sides with full navigation controls
 * @param props
 * @returns
 */
export function SlideShow({
  children,
  disableControls,
  barColor,
  className = '',
  leftClassName = '',
  rightClassName = '',
  nextButtonProps,
  config,
}: SlideShowProps) {
  return (
    <div className={clsx('slide-show', className)}>
      <div className={clsx('slide-show__left', leftClassName)} id="gallery-left">
        {children[0]}
      </div>
      <div className={clsx('slide-show__right', rightClassName)} id="gallery-right">
        {children[1]}
      </div>
      <SlideShowControls
        config={config}
        disableControls={disableControls}
        barColor={barColor}
        nextButtonProps={nextButtonProps}
      />
    </div>
  );
}
