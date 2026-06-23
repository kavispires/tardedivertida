import { mockDrawing } from '@mock/drawing';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
import { useDevFeatures } from '@hooks/useDevFeatures';
import { useLanguage } from '@hooks/useLanguage';
import { useMock } from '@hooks/useMock';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { PanicIcon } from '@icons/PanicIcon';
// Components
import { ArteRuimTimerSound } from '@components/audio/ArteRuimTimerSound';
import { DrawingCanvas } from '@components/canvas/DrawingCanvas';
import { TextCard } from '@components/cards/TextCard';
import { DevButton } from '@components/debug/DevButton';
import { Step, type StepProps } from '@components/steps/Step';
// Internal
import type { ArteRuimCustomCard } from './utils/types';

type StepDrawProps = {
  secretCard: ArteRuimCustomCard;
  onSubmitDrawing: (payload: { drawing: string; cardId: string }) => void;
  startDrawingTimer: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepDraw({ secretCard, onSubmitDrawing, startDrawingTimer, announcement }: StepDrawProps) {
  const { translate } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  const [lines, setLines] = useState<CanvasLine[]>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const { seconds, start, isRunning } = useCountdown({
    duration: 12,
    autoStart: false,
    onExpire: () => {
      setTimesUp(true);
      onSubmitDrawing({
        drawing: JSON.stringify(lines),
        cardId: secretCard.id,
      });
    },
  });

  useEffect(() => {
    if (!isRunning && startDrawingTimer) {
      start();
    }
  }, [startDrawingTimer, isRunning, start]);

  const onMockDrawing = () =>
    onSubmitDrawing({
      drawing: JSON.stringify(mockDrawing()),
      cardId: secretCard.id,
    });

  useMock(() => {
    onMockDrawing();
  });

  return (
    <Step announcement={announcement}>
      <Flex
        className={isRunning || isTimesUp ? getAnimationClass('fadeIn') : 'invisible'}
        align="center"
        vertical
      >
        <TextCard
          size="large"
          header={translate({
            pt: 'Desenhe',
            en: 'Draw',
            custom: isDebugEnabled ? secretCard?.id : undefined,
          })}
          footer={Array(secretCard?.level).fill('•').join('')}
          className="a-draw-step__card"
          color="yellow"
        >
          {isRunning && (
            <>
              {secretCard?.text}
              <span className="a-draw-step__timer">{seconds > 1 ? seconds - 2 : 0}</span>
            </>
          )}
        </TextCard>
        {isRunning && <ArteRuimTimerSound />}

        <DevButton onClick={onMockDrawing}>Mock Drawing</DevButton>

        <div className="disable-mobile-drag">
          {isTimesUp ? (
            <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
          ) : (
            <DrawingCanvas
              lines={lines}
              setLines={setLines}
              showControls
            />
          )}
        </div>
      </Flex>
    </Step>
  );
}
