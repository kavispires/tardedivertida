import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { useAudio } from 'react-use';
// Utils
import { useDevFeatures, useGlobalState, useLanguage } from 'hooks';
import { inNSeconds } from 'utils/helpers';
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
};

export function StepDraw({ secretCard, onSubmitDrawing }: StepDrawProps) {
  const { translate } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);
  const [volume] = useGlobalState('volume');
  const [audio, , controls] = useAudio({
    src: arteRuimTimer,
    autoPlay: true,
  });

  // Updated volume
  useEffect(() => {
    controls.volume(volume);
  }, [volume]); // eslint-disable-line

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(11),
    autoStart: true,
    onExpire: () => {
      setTimesUp(true);
      onSubmitDrawing({
        drawing: JSON.stringify(lines),
        cardId: secretCard.id,
      });
    },
  });

  return (
    <Step>
      <Card
        size="large"
        header={translate('Desenhe', 'Draw', isDebugEnabled ? secretCard?.id : undefined)}
        footer={Array(secretCard?.level).fill('•').join('')}
        className="a-draw-step__card"
        color="yellow"
      >
        {secretCard?.text}
        <span className="a-draw-step__timer">{seconds > 0 ? seconds - 1 : 0}</span>
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
