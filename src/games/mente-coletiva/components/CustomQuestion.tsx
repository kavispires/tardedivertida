import { useState } from 'react';
// Ant Design Resources
import { Button, Input, InputNumber, Select, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';

type CustomQuestionProps = {
  onSubmit: GenericFunction;
  userId: PlayerId;
};

export function CustomQuestion({ onSubmit, userId }: CustomQuestionProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [questionType, setQuestionType] = useState(translate('Cite', 'What are'));
  const [questionNumber, setQuestionNumber] = useState<number>(3);
  const [questionText, setQuestionText] = useState('');

  return (
    <>
      <Space className="space-container">
        <Translate pt="OU" en="OR" />
      </Space>
      <Space className="contained center" direction="vertical">
        <Title size="xx-small">
          <Translate pt="Crie uma pergunta" en="Write custom question" />:
        </Title>
        <Space className="m-custom-question-form">
          <Select value={questionType} onChange={(e) => setQuestionType(e)}>
            <Select.Option value={translate('Cite', 'What are')}>
              <Translate pt="Cite" en="What are" />
            </Select.Option>
            <Select.Option value={translate('Complete a frase', 'Fill in the blank')}>
              <Translate pt="Complete a frase" en="Fill in the blank" />
            </Select.Option>
          </Select>
          <InputNumber
            defaultValue={3}
            min={2}
            max={4}
            onChange={(e) => setQuestionNumber(e ?? 3)}
            value={questionNumber}
            placeholder={translate('...escreva aqui', '...write here')}
          />
          <Input onChange={(e) => setQuestionText(e.target.value)} />
        </Space>
        <div className="m-custom-question-sample">
          "{questionType} {questionNumber} {questionText || '...'}"
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
          disabled={!questionText}
          loading={isLoading}
        >
          <Translate pt="Enviar pergunta personalizada" en="Submit custom question" />
        </Button>
      </Space>
    </>
  );
}
