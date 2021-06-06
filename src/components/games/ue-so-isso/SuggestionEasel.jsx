import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Input } from 'antd';

function SuggestionEasel({ id, onChangeInput, value }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 60"
      overflow="visible"
      width="230"
      className="u-suggestion-easel"
    >
      <path fill="#fff" d="M26.7 59.5L14.1.5h202.7l12.6 59z" />
      <path fill="#4d4d4d" d="M216.4 1l12.4 58H27.1L14.7 1h201.7m.8-1H13.5l12.8 60H230L217.2 0z" />
      <path fill="#4d4d4d" d="M24.2 48.3L13.5 0 0 48.3z" />
      <foreignObject x="32.6" y="13.9" width="185" height="300">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <Input
            placeholder="Escreva dica aqui"
            key={id}
            id={id}
            value={value}
            onChange={onChangeInput}
            className="u-suggestion-easel__input"
            bordered={false}
          />
        </div>
      </foreignObject>
      <path opacity=".2" d="M0 48.3L26.3 60l-2.1-11.7z" />
    </svg>
  );
}

SuggestionEasel.propTypes = {
  id: PropTypes.string,
  onChangeInput: PropTypes.func,
  value: PropTypes.string,
};

export default SuggestionEasel;
