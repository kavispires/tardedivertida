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
import { Translate } from 'components';

const WINDOW_DURATION = 10;

type GalleryWindowControlsProps = {
  galleryLength: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  disableControls: boolean;
  barColor: string;
};

export function GalleryWindowControls({
  galleryLength,
  activeIndex,
  setActiveIndex,
  setStep,
  disableControls,
  barColor,
}: GalleryWindowControlsProps) {
  const { minutes, seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: inNSeconds(WINDOW_DURATION * galleryLength),
    autoStart: true,
    onExpire: () => setStep(2),
  });

  const time = minutes * 60 + seconds;

  // Automatically go to the next window every 10 seconds
  useEffect(() => {
    if (time < WINDOW_DURATION * galleryLength && time > 0 && time % WINDOW_DURATION === 0) {
      setActiveIndex((s: number) => Math.min(s + 1, galleryLength - 1));
    }
  }, [time, setActiveIndex, galleryLength]);

  const goToPreviousStep = () => {
    setActiveIndex((s: number) => Math.max(s - 1, 0));
  };

  const goToNextStep = () => {
    setActiveIndex((s: number) => Math.min(s + 1, galleryLength - 1));
  };

  return (
    <div className="a-gallery-window__controls">
      <div className="a-gallery-window__timer-bar">
        <span
          className="a-gallery-window__timer-bar-pill"
          style={{
            width: `${Math.abs((WINDOW_DURATION * time) / galleryLength - 100)}%`,
            backgroundColor: barColor ?? 'gray',
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
            <Translate pt="Desenho Anterior" en="Previous Art" />
          </Button>
          <Button
            size="large"
            icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={isRunning ? pause : resume}
          />
          <Button
            size="large"
            onClick={goToNextStep}
            disabled={disableControls || activeIndex === galleryLength - 1}
          >
            <Translate pt="Próximo Desenho" en="Next Art" /> <StepForwardOutlined />
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
