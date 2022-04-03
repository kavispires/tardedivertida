import { useState } from 'react';
//Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
// Components

type StepTopicSelectionProps = {
  currentTopics: Topic[];
  currentCustomTopic: Topic;
  onSubmitTopic: GenericFunction;
};

export function StepTopicSelection({
  currentTopics,
  currentCustomTopic,
  onSubmitTopic,
}: StepTopicSelectionProps) {
  const { translate } = useLanguage();

  const [customTopic, setCustomTopic] = useState('');

  const onSubmitCustomTopic = () => {
    if (customTopic) {
      onSubmitTopic({ topicId: currentCustomTopic.id, customTopic });
    }
  };

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Selecione uma assunto" en="Select one topic" />
      </Title>

      <ul className="p-topics-card">
        {currentTopics.map((topic) => (
          <li className="p-topics-card__item" key={topic.id}>
            <button onClick={() => onSubmitTopic({ topicId: topic.id })} className="p-topic p-topic--button">
              {topic.text}
            </button>
          </li>
        ))}
        <li className="p-topics-card__item p-topics-card__item--or">
          <Translate pt="ou" en="or" />
        </li>
        <li className="p-topics-card__item p-topics-card__item--custom">
          <div className="p-topic">{currentCustomTopic.text}</div>
          <Input
            className="p-custom-topic__input"
            placeholder={translate('Escreva aqui', 'Write here')}
            onChange={(e) => setCustomTopic(e.target.value)}
            onPressEnter={onSubmitCustomTopic}
          />
          {Boolean(customTopic) && (
            <Button type="primary" onClick={onSubmitCustomTopic} className="p-custom-topic__button">
              <Translate pt="Enviar sugestão" en="Send suggestion" />
            </Button>
          )}
        </li>
      </ul>
    </Step>
  );
}
