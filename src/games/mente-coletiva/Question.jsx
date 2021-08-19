import React from 'react';
import PropTypes from 'prop-types';

export function Question({ question }) {
  return (
    <span className="m-question m-question--span">
      <span className="m-question__prefix">{question.prefix}</span>
      <span className="m-question__number">{question.number}</span>
      <span className="m-question__suffix">{question.suffix}</span>
    </span>
  );
}

Question.propTypes = {
  number: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};
