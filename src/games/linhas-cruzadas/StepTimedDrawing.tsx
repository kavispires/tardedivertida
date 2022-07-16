import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { Button, Space } from 'antd';
// Utils
import { AVATARS } from 'utils/avatars';
import { DRAWING_TIME_IN_SECONDS } from './utils/constants';
import { inNSeconds } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { Card } from 'components/cards';
import { TimerBar } from 'components/timers';
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { AnimatedLoaderIcon } from 'components/icons/AnimatedLoaderIcon';

type StepTimedDrawingProps = {
  currentPrompt: Prompt;
  onSubmitDrawing: GenericFunction;
  players: GamePlayers;
};

export function StepTimedDrawing({ currentPrompt, onSubmitDrawing, players }: StepTimedDrawingProps) {
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(DRAWING_TIME_IN_SECONDS),
    autoStart: true,
    onExpire: () => {
      setTimesUp(true);
      onSubmit();
    },
  });

  const onSubmit = () =>
    onSubmitDrawing({
      drawing: JSON.stringify(lines),
    });

  const timer = minutes * 60 + seconds;

  const author = players[currentPrompt.author];

  return (
    <Step>
      <Card size="large" header={author.name} color={AVATARS[author.avatarId].color}>
        {currentPrompt.content}
      </Card>
      <TimerBar steps={90} value={timer} total={DRAWING_TIME_IN_SECONDS} type="circle" />
      {isTimesUp ? (
        <AnimatedLoaderIcon style={{ background: 'white', width: '250px', padding: '125px' }} />
      ) : (
        <DrawingCanvas lines={lines} setLines={setLines} showControls />
      )}
      <Space className="space-container" align="center">
        <Button type="primary" onClick={() => onSubmit()} size="large">
          <Translate pt="Enviar desenho" en="Submit drawing" />
        </Button>
      </Space>
    </Step>
  );
}
