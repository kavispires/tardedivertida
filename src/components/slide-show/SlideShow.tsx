import clsx from 'clsx';
import { ReactNode } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { UseStep } from 'hooks/useStep';
// Components
import { SlideShowControls } from './SlideShowControls';

type SlideShowProps = {
  players: GamePlayers;
  children: [ReactNode, ReactNode];
  length: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: UseStep['setStep'];
  disableControls: boolean;
  barColor: string;
  windowDuration: number;
  /**
   * Optional custom class name
   */
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
};

/**
 * Display Slick show with a left and right sides with full navigation controls
 * @param props
 * @returns
 */
export function SlideShow({
  children,
  length,
  activeIndex,
  setActiveIndex,
  setStep,
  disableControls,
  barColor,
  windowDuration = 10,
  className = '',
  leftClassName = '',
  rightClassName = '',
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
        length={length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={disableControls}
        barColor={barColor}
        windowDuration={windowDuration}
      />
    </div>
  );
}
