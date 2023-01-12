import { useState } from 'react';
// AntDesign Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockText } from '../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';
import { MinigameTitle } from './MinigameTitle';

export const TaskEspiaoEntreNos = ({ task, round, onSubmitTask, user }: TaskProps) => {
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
              Você está em um(a) <TextHighlight>{task.data.location.name}</TextHighlight>. Você é um(a){' '}
              <TextHighlight>{task.data.location.roles[task.data.roleIndex]}</TextHighlight>.<br />
              Agora, responda à pergunta abaixo com uma resposta simples.
            </>
          }
          en={
            <>
              You are at/in/on a <TextHighlight>{task.data.location.name}</TextHighlight>. You are a{' '}
              <TextHighlight>{task.data.location.roles[task.data.roleIndex]}</TextHighlight>.<br />
              Now, simply answer the following question.
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <Card>{task.data.question}</Card>
      </Space>

      <Instruction contained>
        <Translate
          pt={<>Responda à pergunta abaixo com uma resposta simples.</>}
          en={<>Answer the prompt below with a simple answer.</>}
        />
      </Instruction>

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
