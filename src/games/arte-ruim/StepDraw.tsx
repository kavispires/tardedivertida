import { mockDrawing } from 'mock/drawing';
import { useEffect, useState } from 'react';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { ArteRuimTimerSound } from 'components/audio/ArteRuimTimerSound';
import { DrawingCanvas } from 'components/canvas';
import { Card } from 'components/cards';
import { DevButton } from 'components/debug';
import { Step, type StepProps } from 'components/steps';
// Internal
import type { ArteRuimCard } from './utils/types';

type StepDrawProps = {
  secretCard: ArteRuimCard | PlainObject;
  onSubmitDrawing: GenericFunction;
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
    onSubmitDrawing({
      drawing: JSON.stringify(mockDrawing()),
      cardId: secretCard.id,
    });
  });

  return (
    <Step announcement={announcement}>
      <Card
        size="large"
        header={translate('Desenhe', 'Draw', isDebugEnabled ? secretCard?.id : undefined)}
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
      </Card>
      {isRunning && <ArteRuimTimerSound />}

      <DevButton onClick={onMockDrawing}>Mock Drawing</DevButton>

      {isTimesUp ? (
        <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
      ) : (
        <DrawingCanvas
          lines={lines}
          setLines={setLines}
        />
      )}
    </Step>
  );
}
