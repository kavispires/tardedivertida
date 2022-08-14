import { useEffect } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
// Hooks
import { useCountdown } from 'hooks';
// Components
import { Translate } from 'components/language';

type SlideShowControlsProps = {
  length: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  disableControls: boolean;
  barColor: string;
  windowDuration: number;
};

export function SlideShowControls({
  length,
  activeIndex,
  setActiveIndex,
  setStep,
  disableControls,
  barColor = 'gray',
  windowDuration = 10,
}: SlideShowControlsProps) {
  const { timeLeft, isRunning, pause, resume } = useCountdown({
    duration: windowDuration * length,
    autoStart: true,
    onExpire: () => setStep(2),
  });

  // Automatically go to the next window every {windowDuration} seconds
  useEffect(() => {
    if (timeLeft < windowDuration * length && timeLeft > 0 && timeLeft % windowDuration === 0) {
      setActiveIndex((s: number) => Math.min(s + 1, length - 1));
    }
  }, [timeLeft, setActiveIndex, length, windowDuration]);

  const goToPreviousStep = () => {
    setActiveIndex((s: number) => Math.max(s - 1, 0));
  };

  const goToNextStep = () => {
    setActiveIndex((s: number) => Math.min(s + 1, length - 1));
  };

  return (
    <div className="slide-show__controls">
      <div className="slide-show__controls-timer-bar">
        <div className="slide-show__controls-timer-bar-base">
          {Array(length)
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
            })}
        </div>
        <span
          className="slide-show__controls-timer-bar-pill"
          style={{
            width: `${Math.abs((windowDuration * timeLeft) / length - 100)}%`,
            backgroundColor: barColor,
          }}
        ></span>
      </div>

      {!disableControls && (
        <Space>
          <Button
            size="large"
            icon={<StepBackwardOutlined />}
            onClick={goToPreviousStep}
            disabled={disableControls || activeIndex === 0}
          >
            <Translate pt="Anterior" en="Previous" />
          </Button>
          <Button
            size="large"
            icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={isRunning ? pause : resume}
          />
          <Button
            size="large"
            onClick={goToNextStep}
            disabled={disableControls || activeIndex === length - 1}
          >
            <Translate pt="Próximo" en="Next" /> <StepForwardOutlined />
          </Button>
          <Button
            size="large"
            onClick={() => setStep(2)}
            icon={<TrophyOutlined />}
            disabled={disableControls}
          >
            <Translate pt="Ver Ranking" en="See Ranking" />
          </Button>
        </Space>
      )}
    </div>
  );
}
