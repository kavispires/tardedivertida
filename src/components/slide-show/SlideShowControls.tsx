import { useEffect, useMemo } from 'react';
// Ant Design Resources
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, type ButtonProps, Space } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import type { SlideShowConfig } from 'hooks/useSlideShow';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';

type SlideShowControlsProps = {
  /**
   * Slide show configuration provided by useSlideShow
   */
  config: SlideShowConfig;
  /**
   * The color of the progress bar (default: gray)
   */
  barColor: string;
  /**
   * Prop indicating if the controls should be disabled
   */
  disableControls?: boolean;
  /**
   * Next Button props (See Ranking Button)
   */
  nextButtonProps?: ButtonProps;
};

export function SlideShowControls({
  config,
  disableControls,
  barColor = 'gray',
  nextButtonProps,
}: SlideShowControlsProps) {
  const slideDuration = config.slideDuration ?? 10;
  const totalDuration = slideDuration * config.length;
  const { timeLeft, isRunning, pause, resume } = useCountdown({
    duration: totalDuration,
    autoStart: true,
    onExpire: () => config.onExpire(),
  });
  const disableControlsFlag = disableControls ?? config.isFirstGalleryRunThrough;

  // Automatically go to the next window every {windowDuration} seconds
  // biome-ignore lint/correctness/useExhaustiveDependencies: isRunning shouldn't retrigger the effect
  useEffect(() => {
    const expectedSlideIndex = Math.max(
      0,
      Math.min(config.length - 1, Math.floor((totalDuration - timeLeft) / slideDuration)),
    );
    if (isRunning && timeLeft < totalDuration && timeLeft > 0 && expectedSlideIndex !== config.slideIndex) {
      config.setSlideIndex(expectedSlideIndex);
    }
    return () => {};
  }, [timeLeft, config, slideDuration, totalDuration]);

  const goToPreviousSlide = () => {
    pause();
    config.setSlideIndex((s: number) => Math.max(s - 1, 0));
  };

  const goToNextSlide = () => {
    pause();
    config.setSlideIndex((s: number) => Math.min(s + 1, config.length - 1));
  };

  const slots = useMemo(() => {
    return Array(config.length)
      .fill('')
      .map((e, i) => {
        return (
          <div
            key={`control-timer-bar-${e + i}`}
            className="slide-show__controls-timer-bar-node"
            style={{ width: `${99 / config.length}%` }}
          >
            {e}
          </div>
        );
      });
  }, [config.length]);

  return (
    <div className="slide-show__controls">
      <div className="slide-show__controls-timer-bar">
        <div className="slide-show__controls-timer-bar-base">{slots}</div>
        <span
          className="slide-show__controls-timer-bar-pill"
          style={{
            width: `${calculateProgress(totalDuration, timeLeft)}%`,
            backgroundColor: barColor,
          }}
        ></span>
      </div>

      <Space
        style={{ opacity: disableControlsFlag ? 0 : 100 }}
        className={getAnimationClass('fadeIn')}
      >
        <Button
          size="large"
          icon={<StepBackwardOutlined />}
          onClick={goToPreviousSlide}
          disabled={disableControlsFlag || config.slideIndex === 0}
        >
          <Translate
            pt="Anterior"
            en="Previous"
          />
        </Button>
        <Button
          size="large"
          icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : resume}
        />
        <Button
          size="large"
          onClick={goToNextSlide}
          disabled={disableControlsFlag || config.slideIndex === config.length - 1}
        >
          <Translate
            pt="Próximo"
            en="Next"
          />{' '}
          <StepForwardOutlined />
        </Button>
        <Button
          {...nextButtonProps}
          size="large"
          onClick={() => config.onExpire()}
          icon={nextButtonProps?.icon ?? <TrophyOutlined />}
          disabled={disableControlsFlag}
        >
          {nextButtonProps?.children ?? (
            <Translate
              pt="Ver Ranking"
              en="See Ranking"
            />
          )}
        </Button>
      </Space>
    </div>
  );
}

function calculateProgress(totalDuration: number, timeLeft: number): number {
  if (totalDuration === 0) return 100; // Handle case to avoid division by zero
  return (1 - timeLeft / totalDuration) * 100;
}
