import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Title, Translate } from '../../components/shared';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';

function QuestionSelection({ currentQuestions, onSubmitQuestion, players, roundType }) {
  return (
    <div className="m-step">
      <Title>
        <Translate pt="Selecione uma das perguntas" en="Select one of the questions" />
      </Title>

      <ul className="m-questions">
        {currentQuestions.map((question) => (
          <li className="m-questions__item" key={question.id}>
            <button
              onClick={() => onSubmitQuestion({ questionId: question.id })}
              className="m-question m-question--button"
              size="large"
            >
              <span className="m-question__prefix">{question.prefix}</span>
              <span className="m-question__number">{question.number}</span>
              <span className="m-question__suffix">{question.suffix}</span>
            </button>
          </li>
        ))}
      </ul>

      <RoundType roundType={roundType} />

      <Pasture players={players} />
    </div>
  );
}

QuestionSelection.propTypes = {
  currentQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      prefix: PropTypes.string,
      number: PropTypes.number,
      suffix: PropTypes.string,
    })
  ),
  onQuestionSelection: PropTypes.func,
  players: PropTypes.object,
};

export default QuestionSelection;
