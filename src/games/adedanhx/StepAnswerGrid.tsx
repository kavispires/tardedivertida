import { useState } from 'react';
// Ant Design Resources
import { Button, Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Utils
import { SEPARATOR } from '@utils/constants';
// Icons
import { LockIcon } from '@icons/LockIcon';
import { StopIcon } from '@icons/StopIcon';
// Components
import { DevButton } from '@components/debug/DevButton';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TimerClock } from '@components/timers/TimerClock';
// Internal
import type { AdedanhxGrid, Answer, SubmitGridAnswersPayload } from './utils/types';
import { buildAnswerSheet } from './utils/helpers';
import { ANSWERING_TIME, ANSWERING_TIME_IN_MINUTES } from './utils/constants';
import { mockAnswers } from './utils/mocks';
import { Grid } from './components/Grid';
import { StopAnnouncement } from './components/StopAnnouncement';

type StepAnswerGridProps = {
  players: GamePlayers;
  user: GamePlayer;
  grid: AdedanhxGrid;
  onSubmitAnswers: (payload: SubmitGridAnswersPayload) => void;
  stoppedBy?: UID | false;
};

export function StepAnswerGrid({ grid, onSubmitAnswers, user, players, stoppedBy }: StepAnswerGridProps) {
  const { isLoading } = useLoading();
  const [answers, setAnswers] = useState<Record<string, Answer>>(buildAnswerSheet(grid));

  const onSubmit = (stop?: boolean) => {
    onSubmitAnswers({
      answers: Object.values(answers).reduce((acc: Dictionary<string>, curr) => {
        if (curr.answer) {
          acc[curr.id] = `${curr.answer}${SEPARATOR}${curr.timestamp}`;
        }
        return acc;
      }, {}),
      stop: stop ? user.id : undefined,
    });
  };

  const { timeLeft, seconds, minutes } = useCountdown({
    duration: ANSWERING_TIME,
    onExpire: onSubmit,
  });

  const updateAnswer = (id: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        answer: answer.trim(),
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
      <StepTitle>
        <Translate
          pt="Complete a grade"
          en="Complete the grid"
        />{' '}
        <TimerClock
          seconds={seconds}
          minutes={minutes}
          iconSize="large"
          className="timer"
        />
      </StepTitle>

      {stoppedBy && (
        <StopAnnouncement
          stopper={players[stoppedBy]}
          onSubmit={onSubmit}
        />
      )}

      <RuleInstruction type="rule">
        <Translate
          en="Write the answers in the order you think is best. You have a total of <time>minutes</time>!<br/>Don't forget to press the {lockIcon} lock button after each answer, pressing tab will auto-lock for you!"
          pt="Escreva na ordem que achar melhor. Você tem um total de <time>minutos</time>!<br/>Não se esqueça de apertar o botão {lockIcon} cadeado após cada resposta, apertando tab ele vai auto-travar pra você!"
          values={{
            lockIcon: (
              <Icon
                size="small"
                icon={<LockIcon />}
              />
            ),
            time: (content) => (
              <TimeHighlight>
                {ANSWERING_TIME_IN_MINUTES} {content}
              </TimeHighlight>
            ),
          }}
        />
      </RuleInstruction>

      <Grid
        grid={grid}
        answers={answers}
        updateAnswer={updateAnswer}
        toggleLock={toggleLock}
      />

      <RuleInstruction type="rule">
        <Translate
          pt="Se você acabar todas as células antes do tempo você pode apertar stop para finalizar a rodada."
          en="If you finish all the cells before the time you can press stop to end the round."
        />
        <Flex
          justify="center"
          gap={8}
        >
          <DevButton
            ghost
            onClick={() => setAnswers(mockAnswers(answers, grid.xHeaders, grid.yHeaders))}
          >
            Mock Answers
          </DevButton>
          <DevButton
            ghost
            onClick={() => setAnswers(mockAnswers(answers, grid.xHeaders, grid.yHeaders, true))}
          >
            Mock Stop
          </DevButton>
          <Button
            type="primary"
            size="large"
            className="button"
            onClick={() => onSubmit(true)}
            disabled={isLoading || timeLeft < 20 || !allLocked}
            loading={isLoading}
            icon={
              <Icon
                size="small"
                icon={<StopIcon />}
              />
            }
          >
            <Translate
              pt="STOP!"
              en="STOP!"
            />
          </Button>
        </Flex>
      </RuleInstruction>
    </Step>
  );
}
