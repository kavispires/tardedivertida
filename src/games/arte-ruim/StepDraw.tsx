import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Utils
import { useLanguage } from '../../hooks';
import { inNSeconds } from '../../utils/helpers';
// Components
import { Card, Step } from '../../components';
import { DrawingCanvas } from '../../components/canvas';
import { Panic } from '../../components/icons';

type StepDrawProps = {
  secretCard: ArteRuimCard | PlainObject;
  onSubmitDrawing: GenericFunction;
};

export function StepDraw({ secretCard, onSubmitDrawing }: StepDrawProps) {
  const { translate } = useLanguage();
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);

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
        header={translate('Desenhe', 'Draw')}
        footer={Array(secretCard?.level).fill('•').join('')}
        className="a-draw-step__card"
        color="yellow"
      >
        {secretCard?.text}
        <span className="a-draw-step__timer">{seconds > 0 ? seconds - 1 : 0}</span>
      </Card>
      {isTimesUp ? (
        <Panic style={{ background: 'white', width: '500px', padding: '2em' }} />
      ) : (
        <DrawingCanvas lines={lines} setLines={setLines} />
      )}
    </Step>
  );
}