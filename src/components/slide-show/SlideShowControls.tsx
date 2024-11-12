import { ReactNode, useEffect, useMemo } from 'react';
// Ant Design Resources
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { UseStep } from 'hooks/useStep';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';

type SlideShowControlsProps = {
  length: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: UseStep['setStep'];
  disableControls: boolean;
  barColor: string;
  windowDuration: number;
  rankingButtonLabel?: ReactNode;
};

export function SlideShowControls({
  length,
  activeIndex,
  setActiveIndex,
  setStep,
  disableControls,
  barColor = 'gray',
  windowDuration = 10,
  rankingButtonLabel,
}: SlideShowControlsProps) {
  const totalDuration = windowDuration * length;
  const { timeLeft, isRunning, pause, resume } = useCountdown({
    duration: totalDuration,
    autoStart: true,
    onExpire: () => setStep(2),
  });

  // Automatically go to the next window every {windowDuration} seconds
  useEffect(() => {
    if (timeLeft < totalDuration && timeLeft > 0 && timeLeft % windowDuration === 0) {
      setActiveIndex((s: number) => Math.min(s + 1, length - 1));
    }
  }, [timeLeft, setActiveIndex, length, windowDuration, totalDuration]);

  const goToPreviousSlide = () => {
    setActiveIndex((s: number) => Math.max(s - 1, 0));
  };

  const goToNextSlide = () => {
    setActiveIndex((s: number) => Math.min(s + 1, length - 1));
  };

  const slots = useMemo(() => {
    return Array(length)
      .fill('')
      .map((e, i) => {
        return (
          <div
            key={`control-timer-bar-${e + i}`}
            className="slide-show__controls-timer-bar-node"
            style={{ width: `${99 / length}%` }}
          >
            {e}
          </div>
        );
      });
  }, [length]);

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

      <Space style={{ opacity: disableControls ? 0 : 100 }} className={getAnimationClass('fadeIn')}>
        <Button
          size="large"
          icon={<StepBackwardOutlined />}
          onClick={goToPreviousSlide}
          disabled={disableControls || activeIndex === 0}
        >
          <Translate pt="Anterior" en="Previous" />
        </Button>
        <Button
          size="large"
          icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : resume}
        />
        <Button size="large" onClick={goToNextSlide} disabled={disableControls || activeIndex === length - 1}>
          <Translate pt="Próximo" en="Next" /> <StepForwardOutlined />
        </Button>
        <Button size="large" onClick={() => setStep(2)} icon={<TrophyOutlined />} disabled={disableControls}>
          {rankingButtonLabel ?? <Translate pt="Ver Ranking" en="See Ranking" />}
        </Button>
      </Space>
    </div>
  );
}

function calculateProgress(totalDuration: number, timeLeft: number): number {
  if (totalDuration === 0) return 100; // Handle case to avoid division by zero
  return (1 - timeLeft / totalDuration) * 100;
}
