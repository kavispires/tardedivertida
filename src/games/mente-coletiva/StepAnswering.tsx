import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getEntryId } from 'utils/helpers';
// Components
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { Title } from 'components/text';
import { TimedTimerClock } from 'components/timers';
// Internal
import type { Question } from './utils/types';
import { mockAnswers } from './utils/mock';
import { Pasture } from './components/Pasture';
import { AnsweringRules } from './components/RulesBlobs';

type StepAnsweringProps = {
  currentQuestion: Question;
  onSubmitAnswers: GenericFunction;
  players: GamePlayers;
  roundType: number;
  user: GamePlayer;
  pastureSize: number;
  timedAnswers?: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAnswering({
  user,
  currentQuestion,
  players,
  roundType,
  onSubmitAnswers,
  pastureSize,
  announcement,
  timedAnswers = false,
}: StepAnsweringProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [answers, setAnswers] = useState({});

  // DEV: Mock answers
  useMock(() => {
    // onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) });
  }, []);

  const onWriteAnswer = (e: any) => {
    setAnswers((s) => ({
      ...s,
      [e.target.id]: e.target.value.toUpperCase().trim(),
    }));
  };

  const isDisabled =
    Object.keys(answers).length < currentQuestion.number ||
    new Set(Object.values(answers)).size !== currentQuestion.number;

  const onPressEnter = () => {
    if (!isDisabled) {
      onSubmitAnswers({ answers });
    }
  };

  return (
    <Step fullWidth announcement={announcement}>
      <div className="m-step__contained-content">
        <Title level={3} size="small">
          <Translate pt="Responda a pergunta" en="Answer the question" />
          {Boolean(timedAnswers) && (
            <TimedTimerClock
              duration={2 * 60}
              onExpire={() => {
                if (!user.ready && !isLoading) {
                  onSubmitAnswers({ answers });
                }
              }}
              disabled={Boolean(!timedAnswers)}
            />
          )}
          :
        </Title>

        <GroupQuestionCard question={currentQuestion} />

        <PopoverRule content={<AnsweringRules />} />

        <ol className="m-answers">
          {Array(currentQuestion.number)
            .fill(1)
            .map((i, index) => {
              const num = i + index;
              const key = `answer-${index}`;
              const id = getEntryId(['answer', String(index), user.id]);
              return (
                <li className="m-answers__item" key={key}>
                  <Input
                    className="m-answers__input"
                    id={id}
                    placeholder={translate(`Escreva a resposta ${num} aqui`, `Write answer ${num} here`)}
                    autoComplete="off"
                    onChange={onWriteAnswer}
                    onPressEnter={onPressEnter}
                  />
                </li>
              );
            })}
        </ol>
        <Space className="space-container" align="center">
          <Button
            type="primary"
            disabled={isDisabled || isLoading}
            onClick={() => onSubmitAnswers({ answers })}
          >
            <Translate pt="Enviar respostas" en="Submit answers" />
          </Button>

          <DevButton
            ghost
            onClick={() => onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) })}
          >
            Mock Answers
          </DevButton>
        </Space>
      </div>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
