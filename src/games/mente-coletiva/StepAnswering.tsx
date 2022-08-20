import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Utils
import { getEntryId } from 'utils/helpers';
import { mockAnswers } from './utils/mock';
// Components

import { Pasture } from './components/Pasture';
import { Question } from './components/Question';
import { AnsweringRules } from './components/RulesBlobs';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { ReadyPlayersBar } from 'components/players';

type StepAnsweringProps = {
  currentQuestion: MQuestion;
  onSubmitAnswers: GenericFunction;
  players: GamePlayers;
  roundType: number;
  user: GamePlayer;
  pastureSize: number;
};

export function StepAnswering({
  user,
  currentQuestion,
  players,
  roundType,
  onSubmitAnswers,
  pastureSize,
}: StepAnsweringProps) {
  const { translate } = useLanguage();
  const [answers, setAnswers] = useState({});

  // DEV: Mock answers
  useMock(() => {
    onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) });
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
    <Step fullWidth>
      <div className="m-step__contained-content">
        <Title level={3}>
          <Translate pt="Responda a pergunta:" en="Answer the question:" />
          <Question question={currentQuestion} />
        </Title>

        <PopoverRule content={<AnsweringRules />} />

        <ol className="m-answers">
          {Array(currentQuestion.number)
            .fill(1)
            .map((i, index) => {
              const num = i + index;
              const key = `answer-${index}`;
              const id = getEntryId(['answer', index, user.id]);
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
          <Button type="primary" disabled={isDisabled} onClick={() => onSubmitAnswers({ answers })}>
            <Translate pt="Enviar respostas" en="Submit answers" />
          </Button>
        </Space>
      </div>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />

      <Space className="space-container" align="center">
        <ReadyPlayersBar players={players} />
      </Space>
    </Step>
  );
}
