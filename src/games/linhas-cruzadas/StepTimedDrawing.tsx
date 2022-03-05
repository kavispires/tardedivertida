import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button } from 'antd';
// Utils
import { AVATARS } from 'utils/constants';
import { DRAWING_TIME_IN_SECONDS } from './constants';
import { inNSeconds } from 'utils/helpers';
// Components
import { ButtonContainer, Card, DrawingCanvas, Icons, Step, TimerBar, Translate } from 'components';

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
        <Icons.AnimatedLoader style={{ background: 'white', width: '250px', padding: '125px' }} />
      ) : (
        <DrawingCanvas lines={lines} setLines={setLines} showControls />
      )}
      <ButtonContainer>
        <Button type="primary" onClick={() => onSubmit()} size="large">
          <Translate pt="Enviar desenho" en="Submit drawing" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
