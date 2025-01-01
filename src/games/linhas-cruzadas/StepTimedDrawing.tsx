import { useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { AVATARS } from 'utils/avatars';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { TimedTimerBar } from 'components/timers';
// Internal
import type { Prompt } from './utils/types';
import { DRAWING_TIME_IN_SECONDS } from './utils/constants';

type StepTimedDrawingProps = {
  currentPrompt: Prompt;
  onSubmitDrawing: GenericFunction;
  players: GamePlayers;
};

export function StepTimedDrawing({ currentPrompt, onSubmitDrawing, players }: StepTimedDrawingProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);
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
      <SpaceContainer>
        <Button type="primary" onClick={() => onSubmit()} size="large">
          <Translate pt="Enviar desenho" en="Submit drawing" />
        </Button>
      </SpaceContainer>
    </Step>
  );
}
