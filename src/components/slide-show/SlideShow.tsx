import clsx from 'clsx';
// Components
import { SlideShowControls } from './SlideShowControls';

type SlideShowProps = {
  players: GamePlayers;
  children: [ReactChildren, ReactChildren];
  galleryLength: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  disableControls: boolean;
  barColor: string;
  windowDuration: number;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
};

export function SlideShow({
  children,
  galleryLength,
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
    <div className={clsx('gallery', className)}>
      <div className={clsx('gallery__left', leftClassName)} id="gallery-left">
        {children[0]}
      </div>
      <div className={clsx('gallery__right', rightClassName)} id="gallery-right">
        {children[1]}
      </div>
      <SlideShowControls
        galleryLength={galleryLength}
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