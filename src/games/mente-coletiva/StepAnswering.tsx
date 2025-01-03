import { useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getEntryId } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
import { TimedTimerClock } from 'components/timers';
// Internal
import type { Question, SubmitAnswersPayload } from './utils/types';
import { mockAnswers } from './utils/mock';
import { Pasture } from './components/Pasture';
import { AnsweringRules } from './components/RulesBlobs';

type StepAnsweringProps = {
  currentQuestion: Question;
  onSubmitAnswers: (payload: SubmitAnswersPayload) => void;
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

  const onWriteAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <StepTitle size="small">
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
        </StepTitle>

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
        <SpaceContainer>
          <DevButton
            onClick={() => onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) })}
          >
            Mock Answers
          </DevButton>

          <SendButton type="primary" disabled={isDisabled} onClick={() => onSubmitAnswers({ answers })}>
            <Translate pt="Enviar respostas" en="Submit answers" />
          </SendButton>
        </SpaceContainer>
      </div>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
