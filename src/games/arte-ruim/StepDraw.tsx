import { useEffect, useState } from 'react';
import { useAudio } from 'react-use';
// Utils
import { useCountdown } from 'hooks/useCountdown';
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Step } from 'components/steps';
import { Card } from 'components/cards';
import { DrawingCanvas } from 'components/canvas';
import { PanicIcon } from 'components/icons/PanicIcon';

// Sound
const arteRuimTimer = require('assets/sounds/arte-ruim-timer.mp3');

type StepDrawProps = {
  secretCard: ArteRuimCard | PlainObject;
  onSubmitDrawing: GenericFunction;
  startDrawingTimer: boolean;
} & AnnouncementProps;

export function StepDraw({ secretCard, onSubmitDrawing, startDrawingTimer, announcement }: StepDrawProps) {
  const { translate } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);
  const [volume] = useGlobalState('volume');
  const [audio, , controls] = useAudio({
    src: arteRuimTimer,
  });

  // Updated volume
  useEffect(() => {
    controls.volume(volume);
  }, [volume]); // eslint-disable-line

  const { seconds, start, isRunning } = useCountdown({
    duration: 11,
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
      controls.play();
      start();
    }
  }, [startDrawingTimer, isRunning, start, controls]);

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
            <span className="a-draw-step__timer">{seconds > 0 ? seconds - 1 : 0}</span>
          </>
        )}
      </Card>
      {audio}
      {isTimesUp ? (
        <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
      ) : (
        <DrawingCanvas lines={lines} setLines={setLines} />
      )}
    </Step>
  );
}
