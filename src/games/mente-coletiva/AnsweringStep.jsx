import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { ButtonContainer, Title, translate, Translate } from '../../components/shared';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';
import { Question } from './Question';
import { isDevEnv, shuffle } from '../../utils';

const mockAnswers = (userId, numAnswers) => {
  const list = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'helio', 'ilha', 'jaguar', 'ky'];
  const shuffled = shuffle(list);

  return Array(numAnswers)
    .fill(0)
    .map((i, index) => ({ [`answer::${index}::${userId}`]: shuffled[i + index] }))
    .reduce((acc, item) => {
      acc = { ...acc, ...item };
      return acc;
    }, {});
};

function AnsweringStep({ user, currentQuestion, players, roundType, onSubmitAnswers }) {
  const language = useLanguage();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (isDevEnv) {
      onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) });
    }
  }, []); // eslint-disable-line

  const onWriteAnswer = (e) => {
    setAnswers((s) => ({
      ...s,
      [e.target.id]: e.target.value.toUpperCase().trim(),
    }));
  };

  const isDisabled =
    Object.keys(answers).length < currentQuestion.number &&
    new Set(Object.keys(answers)).size !== Object.keys(answers).length;

  const onPressEnter = () => {
    if (isDisabled) {
      onSubmitAnswers({ answers });
    }
  };

  return (
    <div className="m-step">
      <div className="m-step__contained-content">
        <Title level={3}>
          <Translate pt="Responda a pergunta:" en="Answer the question:" />
          <Question question={currentQuestion} />
        </Title>

        <ol className="m-answers">
          {Array(currentQuestion.number)
            .fill(1)
            .map((i, index) => {
              const num = i + index;
              const key = `answer-${index}`;
              const id = `answer::${index}::${user.id}`;
              return (
                <li className="m-answers__item" key={key}>
                  <Input
                    className="m-answers__input"
                    id={id}
                    placeholder={translate(
                      `Escreva a resposta ${num} aqui`,
                      `Write answer ${num} here`,
                      language
                    )}
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

      <RoundType roundType={roundType} />

      <Pasture players={players} />
    </div>
  );
}

AnsweringStep.propTypes = {
  currentQuestion: PropTypes.shape({
    number: PropTypes.number,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
  }),
  onSubmitAnswers: PropTypes.func,
  players: PropTypes.object,
  roundType: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default AnsweringStep;
