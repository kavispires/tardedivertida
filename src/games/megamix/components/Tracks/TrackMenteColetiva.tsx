import { useState } from 'react';
// AntDesign Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockText } from '../../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMenteColetiva = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [answer, setAnswer] = useState('');

  const onSubmit = () => {
    if (answer.length > 1) {
      onSubmitAnswer({
        data: { value: answer },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockText() },
    });
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
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
          <span className="m-question__prefix">{track.data.question.prefix}</span>
          <span className="m-question__number">1</span>
          <span className="m-question__suffix">{track.data.question.suffix}</span>
        </span>
      </Card>

      <Space className="space-container" direction="vertical">
        <Input
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={translate('Escreva aqui', 'Answer here')}
          onPressEnter={onSubmit}
          disabled={isLoading || user.ready}
        />
        <Button
          shape="round"
          type="primary"
          disabled={user.ready || answer.length < 2}
          loading={isLoading}
          onClick={onSubmit}
        >
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>
    </>
  );
};
