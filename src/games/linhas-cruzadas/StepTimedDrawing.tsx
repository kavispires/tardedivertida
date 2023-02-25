import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Utils
import { AVATARS } from 'utils/avatars';
import { DRAWING_TIME_IN_SECONDS } from './utils/constants';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { Step } from 'components/steps';
import { Card } from 'components/cards';
import { TimedTimerBar } from 'components/timers';
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';

type StepTimedDrawingProps = {
  currentPrompt: Prompt;
  onSubmitDrawing: GenericFunction;
  players: GamePlayers;
};

export function StepTimedDrawing({ currentPrompt, onSubmitDrawing, players }: StepTimedDrawingProps) {
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const onExpire = () => {
    setTimesUp(true);
    onSubmit();
  };

  const onSubmit = () =>
    onSubmitDrawing({
      drawing: JSON.stringify(lines),
    });

  const author = players[currentPrompt.author];

  return (
    <Step>
      <Card size="large" header={author.name} color={AVATARS[author.avatarId].color}>
        {currentPrompt.content}
      </Card>
      <TimedTimerBar steps={90} duration={DRAWING_TIME_IN_SECONDS} onExpire={onExpire} />
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
