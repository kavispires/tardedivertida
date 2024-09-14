import { mockDrawing } from 'mock/drawing';
import { useEffect, useState } from 'react';
// Types
import { GamePlayer } from 'types/player';
import { TextCard } from 'types/tdr';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { SinaisDeAlertaTimerSound } from 'components/audio/SinaisDeAlertaSound';
import { DrawingCanvas } from 'components/canvas';
import { Card } from 'components/cards';
import { DevButton } from 'components/debug';
import { Step, type StepProps } from 'components/steps';
// Internal
import { getTitle } from './utils/helpers';
import { WarningSignBackgroundMask } from './components/WarningSignBackgroundMask';

type StepDrawProps = {
  user: GamePlayer;
  cards: Dictionary<TextCard>;
  onSubmitDrawing: GenericFunction;
  startDrawingTimer: boolean;
  gameLanguage: Language;
  timeLimit: number;
} & Pick<StepProps, 'announcement'>;

export function StepDraw({
  user,
  cards,
  onSubmitDrawing,
  startDrawingTimer,
  announcement,
  gameLanguage,
  timeLimit,
}: StepDrawProps) {
  const { translate } = useLanguage();

  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const { seconds, start, isRunning } = useCountdown({
    duration: timeLimit + 2,
    autoStart: false,
    onExpire: () => {
      setTimesUp(true);
      onSubmitDrawing({
        drawing: JSON.stringify(lines),
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
    });

  useMock(() => {
    onSubmitDrawing({
      drawing: JSON.stringify(mockDrawing()),
    });
  });

  const title = getTitle(cards, user.currentSubjectId, user.currentDescriptorId, gameLanguage);

  return (
    <Step announcement={announcement}>
      <Card size="large" header={translate('Desenhe', 'Draw')} className="sda-card" color="yellow">
        {isRunning && (
          <>
            {title}
            <span className="sda-card__timer">{seconds > 1 ? seconds - 2 : 0}</span>
          </>
        )}
      </Card>
      {isRunning && <SinaisDeAlertaTimerSound />}

      <DevButton onClick={onMockDrawing}>Mock Drawing</DevButton>

      {isTimesUp ? (
        <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
      ) : (
        <DrawingCanvas
          lines={lines}
          setLines={setLines}
          className="sda-warning-canvas"
          mask={<WarningSignBackgroundMask className="sda-warning-canvas-mask" />}
          showControls={isRunning}
        />
      )}
    </Step>
  );
}
