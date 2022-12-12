import { Button, Input, InputNumber, Select, Space } from 'antd';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { useLoading } from 'hooks/useLoading';
import { useState } from 'react';

type CustomQuestionProps = {
  onSubmit: GenericFunction;
  userId: PlayerId;
};

export function CustomQuestion({ onSubmit, userId }: CustomQuestionProps) {
  const { isLoading } = useLoading();
  const [questionType, setQuestionType] = useState('Cite');
  const [questionNumber, setQuestionNumber] = useState<number>(3);
  const [questionText, setQuestionText] = useState('');

  return (
    <>
      <Space className="space-container">
        <Translate pt="OU" en="OR" />
      </Space>
      <Space className="contained center" direction="vertical">
        <Title size="xx-small">
          <Translate pt="Criar pergunta" en="Write custom question" />
        </Title>
        <div className="m-custom-question-form">
          <Select value={questionType} onChange={(e) => setQuestionType(e)} size="small">
            <Select.Option value="Cite">Cite</Select.Option>
            <Select.Option value="Complete a lacuna com">Complete a lacuna com</Select.Option>
          </Select>
          <InputNumber
            defaultValue={3}
            min={2}
            max={4}
            onChange={(e) => setQuestionNumber(e ?? 3)}
            value={questionNumber}
            size="small"
          />
          <Input onChange={(e) => setQuestionText(e.target.value)} size="small" />
        </div>
        <Button
          onClick={() =>
            onSubmit({
              customQuestion: {
                id: `${userId}-${Date.now()}`,
                prefix: questionType,
                number: questionNumber,
                suffix: questionText,
              },
            })
          }
          loading={isLoading}
        >
          <Translate pt="Enviar pergunta personalizada" en="Submit custom question" />
        </Button>
      </Space>
    </>
  );
}
