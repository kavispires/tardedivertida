import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { Button, Space } from 'antd';
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
// Utils
import { inNSeconds } from 'utils/helpers';
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
  const { minutes, seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: inNSeconds(windowDuration * length),
    autoStart: true,
    onExpire: () => setStep(2),
  });

  const time = minutes * 60 + seconds;

  // Automatically go to the next window every {windowDuration} seconds
  useEffect(() => {
    if (time < windowDuration * length && time > 0 && time % windowDuration === 0) {
      setActiveIndex((s: number) => Math.min(s + 1, length - 1));
    }
  }, [time, setActiveIndex, length, windowDuration]);

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
            width: `${Math.abs((windowDuration * time) / length - 100)}%`,
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
