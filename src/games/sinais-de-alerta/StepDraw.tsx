import { useEffect, useState } from 'react';

// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Utils
import { mockDrawing } from 'mock/drawing';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { Step, type StepProps } from 'components/steps';
import { Card } from 'components/cards';
import { DrawingCanvas } from 'components/canvas';
// TODO: add music
// import { ArteRuimTimerSound } from 'components/audio/ArteRuimTimerSound';
import { DevButton } from 'components/debug';
import { TextCard } from 'types/tdr';
import { GamePlayer } from 'types/player';
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
