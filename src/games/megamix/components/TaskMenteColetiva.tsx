import { Button, Input, Space } from 'antd';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { MinigameTitle } from './MinigameTitle';
import { useState } from 'react';
import { useMock } from 'hooks/useMock';
import { mockText } from '../utils/mock';

export const TaskMenteColetiva = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [answer, setAnswer] = useState('');

  const onSubmitAnswer = () => {
    if (answer.length > 1) {
      onSubmitTask({
        data: { value: answer },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockText() },
    });
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Responda à pergunta abaixo com uma resposta simples.
              <br />O objetivo é responder com o grupo e se juntar ao rebanho!
            </>
          }
          en={
            <>
              Answer the prompt below with a simple answer.
              <br />
              The goal is to give an answer that will match the group so you can join the herd!
            </>
          }
        />
      </Instruction>

      <Card className="m-question-wrapper">
        <span className="m-question m-question--span">
          <span className="m-question__prefix">{task.data.question.prefix}</span>
          <span className="m-question__number">1</span>
          <span className="m-question__suffix">{task.data.question.suffix}</span>
        </span>
      </Card>

      <Space className="space-container" direction="vertical">
        <Input
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={translate('Escreva aqui', 'Answer here')}
          onPressEnter={onSubmitAnswer}
          disabled={isLoading || user.ready}
        />
        <Button
          shape="round"
          type="primary"
          disabled={user.ready || answer.length < 2}
          loading={isLoading}
          onClick={onSubmitAnswer}
        >
          <Translate pt="Selecionar" en="Select" />
        </Button>
      </Space>
    </>
  );
};
