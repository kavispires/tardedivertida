import { useState } from 'react';
// Ant Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage, useMock } from 'hooks';
// Utils
import { getEntryId } from 'utils/helpers';
import { mockAnswers } from './mock';
// Components
import { ButtonContainer, PopoverRule, Step, Title, Translate } from 'components';
import { Pasture } from './Pasture';
import { Question } from './Question';
import { AnsweringRules } from './RulesBlobs';

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
        <ButtonContainer>
          <Button type="primary" disabled={isDisabled} onClick={() => onSubmitAnswers({ answers })}>
            <Translate pt="Enviar respostas" en="Submit answers" />
          </Button>
        </ButtonContainer>
      </div>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
