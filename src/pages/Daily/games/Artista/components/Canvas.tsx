import { Flex } from 'antd';
import { DrawingCanvas } from 'components/canvas';
import { useCountdown } from 'hooks/useCountdown';
import { useState } from 'react';
import { SETTINGS } from '../utils/settings';
import { TimerBar } from 'components/timers';
import { getAnimationClass } from 'utils/helpers';

type CanvasProps = {
  onNextCard: (lines: any) => void;
  maxWidth: number;
};

const duration = SETTINGS.DURATION / SETTINGS.DRAWINGS;

export function Canvas({ onNextCard, maxWidth }: CanvasProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);

  const { timeLeft } = useCountdown({
    duration: duration + 2,
    autoStart: true,
    onExpire: () => {
      onNextCard(lines);
    },
  });

  return (
    <Flex className="full-width" vertical style={{ maxWidth }}>
      <TimerBar value={timeLeft - 1} total={duration} className="artista-time-bar" />
      {timeLeft < 12 && (
        <DrawingCanvas
          lines={lines}
          className={getAnimationClass('zoomIn', { speed: 'faster' })}
          setLines={setLines}
          strokeWidth="small"
          style={{
            transform: `scale(${maxWidth / 500})`,
            transformOrigin: 'top center',
          }}
        />
      )}
    </Flex>
  );
}
