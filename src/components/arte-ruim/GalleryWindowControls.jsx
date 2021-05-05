import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button } from 'antd';
import {
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
// Utils
import { inNSeconds } from '../../utils';

function GalleryWindowControls({ galleryLength, activeIndex, setActiveIndex, setStep }) {
  const { seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: inNSeconds(10 * galleryLength),
    autoStart: true,
    onExpire: () => setStep(1),
  });

  // Automatically go to the next window every 10 seconds
  useEffect(() => {
    if (seconds < 10 * galleryLength && seconds > 0 && seconds % 10 === 0) {
      setActiveIndex((s) => Math.min(s + 1, galleryLength - 1));
    }
  }, [seconds, setActiveIndex, galleryLength]);

  const previousStep = () => {
    setActiveIndex((s) => Math.max(s - 1, 0));
  };

  const nextStep = () => {
    setActiveIndex((s) => Math.min(s + 1, galleryLength - 1));
  };

  return (
    <div className="gallery-window__controls">
      <div className="gallery-window__timer-bar">
        <span style={{ width: `${Math.abs((10 * seconds) / galleryLength - 100)}%` }}></span>
      </div>
      <Button
        size="large"
        icon={<StepBackwardOutlined />}
        onClick={previousStep}
        disabled={activeIndex === 0}
      >
        Desenho Anterior
      </Button>
      <Button
        size="large"
        icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
        onClick={isRunning ? pause : resume}
      />
      <Button size="large" onClick={nextStep} disabled={activeIndex === galleryLength - 1}>
        Próximo Desenho <StepForwardOutlined />
      </Button>
      <Button
        className="gallery-window__go-to-ranking"
        size="large"
        onClick={() => setStep(1)}
        icon={<TrophyOutlined />}
      >
        Ver Ranking
      </Button>
    </div>
  );
}

GalleryWindowControls.propTypes = {
  galleryLength: PropTypes.number,
  activeIndex: PropTypes.number,
  setActiveIndex: PropTypes.func,
  setStep: PropTypes.func,
};

export default GalleryWindowControls;
