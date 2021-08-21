import React, { useState } from 'react';
import PropTypes from 'prop-types';
//Design Resources
import { Button, Input } from 'antd';
// Components
import { Instruction, Title, translate, Translate } from '../../components/shared';
import { useLanguage } from '../../hooks';

function TopicSelectionStep({ currentTopics, currentCustomTopic, onSubmitTopic }) {
  const language = useLanguage();

  const [customTopic, setCustomTopic] = useState('');

  const onSubmitCustomTopic = () => {
    if (customTopic) {
      onSubmitTopic({ topicId: currentCustomTopic.id, customTopic });
    }
  };

  return (
    <div className="p-step">
      <Title>
        <Translate pt="Selecione uma assunto" en="Select one topic" />
      </Title>
      <Instruction level={3}>
        <Translate pt="Ou escreva um de acordo com o tema" en="Or write one according to the given theme" />
      </Instruction>

      <ul className="p-topics-card">
        {currentTopics.map((topic) => (
          <li className="p-topics-card__item" key={topic.id}>
            <button
              onClick={() => onSubmitTopic({ topicId: topic.id })}
              className="p-topic p-topic--button"
              size="large"
            >
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
            placeholder={translate('Escreva aqui', 'Write here', language)}
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
    </div>
  );
}

TopicSelectionStep.propTypes = {
  currentCustomTopic: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  }),
  currentTopics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  onSubmitTopic: PropTypes.func,
};

export default TopicSelectionStep;
