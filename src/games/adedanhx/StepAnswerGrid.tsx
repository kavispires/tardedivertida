import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { buildAnswerSheet } from './utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';
import { LockIcon } from 'icons/LockIcon';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Grid } from './components/Grid';
import { TimerClock } from 'components/timers';
import { useMock } from 'hooks/useMock';
import { mockAnswers } from './utils/mocks';
import { StopIcon } from 'icons/StopIcon';
import { StopAnnouncement } from './components/StopAnnouncement';
import { SEPARATOR } from 'utils/constants';
import { DevButton } from 'components/debug';

type StepAnswerGridProps = {
  players: GamePlayers;
  user: GamePlayer;
  grid: AdedanhxGrid;
  onSubmitAnswers: (payload: SubmitGridAnswersPayload) => void;
  stoppedBy?: PlayerId | false;
};

export function StepAnswerGrid({ grid, onSubmitAnswers, user, players, stoppedBy }: StepAnswerGridProps) {
  const { isLoading } = useLoading();
  const [answers, setAnswers] = useState<Record<string, Answer>>(buildAnswerSheet(grid));

  const onSubmit = (stop?: boolean) => {
    onSubmitAnswers({
      answers: Object.values(answers).reduce((acc: StringDictionary, curr) => {
        if (curr.answer) {
          acc[curr.id] = `${curr.answer}${SEPARATOR}${curr.timestamp}`;
        }
        return acc;
      }, {}),
      stop: stop ? user.id : undefined,
    });
  };

  const { timeLeft, seconds, minutes } = useCountdown({
    duration: 180,
    onExpire: onSubmit,
  });

  const updateAnswer = (id: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        answer,
      },
    }));
  };

  const toggleLock = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        timestamp: prev[id].timestamp ? 0 : timeLeft,
      },
    }));
  };

  // Dev: mock
  useMock(() => {
    setAnswers(mockAnswers(answers, grid.xHeaders, grid.yHeaders));
  });

  const allLocked = Object.values(answers).every((a) => a.timestamp > 0);

  return (
    <Step fullWidth>
      <Title>
        <Translate pt={<>Complete a grade</>} en={<>Complete the grid</>} />{' '}
        <TimerClock seconds={seconds} minutes={minutes} iconSize="large" className="timer" />
      </Title>

      {stoppedBy && <StopAnnouncement stopper={players[stoppedBy]} onSubmit={onSubmit} />}

      <Instruction contained>
        <Translate
          pt={
            <>
              Faça na ordem que achar melhor e não esqueça de aperta do botão de cadeado{' '}
              <IconAvatar size="small" icon={<LockIcon />} /> a cada resposta para que seu tempo seja gravado
              corretamente.
              <br />
              Você tem <TimeHighlight>3 minutos</TimeHighlight>!
            </>
          }
          en={
            <>
              Write it in the order you think is best and don't forget to press the lock button{' '}
              <IconAvatar size="small" icon={<LockIcon />} /> after each answer.
              <br />
              You have <TimeHighlight>3 minutes</TimeHighlight>!
            </>
          }
        />
      </Instruction>

      <Grid grid={grid} answers={answers} updateAnswer={updateAnswer} toggleLock={toggleLock} />

      <Instruction contained>
        <Translate
          pt="Se você acabar todas as células antes do tempo você pode apertar stop para finalizar a rodada."
          en="If you finish all the cells before the time you can press stop to end the round."
        />
      </Instruction>

      <Space className="space-container">
        <DevButton ghost onClick={() => setAnswers(mockAnswers(answers, grid.xHeaders, grid.yHeaders))}>
          Mock Answers
        </DevButton>
        <Button
          type="primary"
          size="large"
          className="button"
          onClick={() => onSubmit(true)}
          disabled={isLoading || timeLeft < 20 || !allLocked}
          loading={isLoading}
          icon={<IconAvatar size="small" icon={<StopIcon />} />}
        >
          <Translate pt="STOP!" en="STOP!" />
        </Button>
      </Space>
    </Step>
  );
}
