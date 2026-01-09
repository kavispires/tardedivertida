import { useState } from 'react';
// Ant Design Resources
import { Divider, Input, InputNumber, Select, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { SubmitCustomQuestionPayload } from '../utils/types';

type CustomQuestionProps = {
  onSubmit: (payload: SubmitCustomQuestionPayload) => void;
  userId: PlayerId;
};

export function CustomQuestion({ onSubmit, userId }: CustomQuestionProps) {
  const { translate } = useLanguage();
  const [questionType, setQuestionType] = useState(translate('Cite', 'What are'));
  const [questionNumber, setQuestionNumber] = useState<number>(3);
  const [questionText, setQuestionText] = useState('');

  return (
    <>
      <Divider>
        <Translate
          pt="OU"
          en="OR"
        />
      </Divider>

      <Space
        className="contained center"
        orientation="vertical"
      >
        <Title size="xx-small">
          <Translate
            pt="Crie uma pergunta"
            en="Write custom question"
          />
          :
        </Title>
        <Space className="m-custom-question-form">
          <Select
            value={questionType}
            onChange={(e) => setQuestionType(e)}
          >
            <Select.Option value={translate('Cite', 'What are')}>
              <Translate
                pt="Cite"
                en="What are"
              />
            </Select.Option>
            <Select.Option value={translate('Complete a frase', 'Fill in the blank')}>
              <Translate
                pt="Complete a frase"
                en="Fill in the blank"
              />
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
        <SendButton
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
        >
          <Translate
            pt="Enviar pergunta personalizada"
            en="Submit custom question"
          />
        </SendButton>
      </Space>
    </>
  );
}
