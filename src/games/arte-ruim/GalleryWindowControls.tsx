import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button, Space } from 'antd';
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
// Utils
import { inNSeconds } from '../../utils/helpers';
// Components
import { Translate } from '../../components/shared';

type GalleryWindowControlsProps = {
  galleryLength: number;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
};

function GalleryWindowControls({
  galleryLength,
  activeIndex,
  setActiveIndex,
  setStep,
}: GalleryWindowControlsProps) {
  const { minutes, seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: inNSeconds(10 * galleryLength),
    autoStart: true,
    onExpire: () => setStep(2),
  });

  // Automatically go to the next window every 10 seconds
  useEffect(() => {
    if (seconds < 10 * galleryLength && seconds > 0 && seconds % 10 === 0) {
      setActiveIndex((s: any) => Math.min(s + 1, galleryLength - 1));
    }
  }, [seconds, setActiveIndex, galleryLength]);

  const previousStep = () => {
    setActiveIndex((s: any) => Math.max(s - 1, 0));
  };

  const nextStep = () => {
    setActiveIndex((s: any) => Math.min(s + 1, galleryLength - 1));
  };

  return (
    <div className="a-gallery-window__controls">
      <div className="a-gallery-window__timer-bar">
        <span style={{ width: `${Math.abs((10 * (minutes * 60 + seconds)) / galleryLength - 100)}%` }}></span>
      </div>
      <Space>
        <Button
          size="large"
          icon={<StepBackwardOutlined />}
          onClick={previousStep}
          disabled={activeIndex === 0}
        >
          <Translate pt="Desenho Anterior" en="Previous Art" />
        </Button>
        <Button
          size="large"
          icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : resume}
        />
        <Button size="large" onClick={nextStep} disabled={activeIndex === galleryLength - 1}>
          <Translate pt="Próximo Desenho" en="Next Art" /> <StepForwardOutlined />
        </Button>
        <Button size="large" onClick={() => setStep(2)} icon={<TrophyOutlined />}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </Button>
      </Space>
    </div>
  );
}

export default GalleryWindowControls;
