import React, { useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Resources
import allWords from '../../resources/um-so-words.json';
// Components
import Title from '../shared/Title';
import Instruction from '../shared/Instruction';

function WordSelectionStep({ words = [], onSendSelectedWords }) {
  const [selectedWords, setSelectedWords] = useState({});

  const onSelectWord = (wordId) => {
    setSelectedWords((s) => {
      const newState = { ...s };
      if (newState[wordId]) {
        delete newState[wordId];
      } else {
        newState[wordId] = true;
      }
      return newState;
    });
  };

  const selectedWordsArray = Object.keys(selectedWords);

  return (
    <div className="u-word-selection-step">
      <Title white>Selecione a Palavra-Secreta</Title>

      <Instruction white>
        A palavra secreta com mais votos será escolhida para essa rodada. Você pode selecionar quantas quiser!
      </Instruction>

      <ul className="u-word-card">
        {words.map((wordId) => {
          return (
            <li className="u-word-card__word" key={wordId}>
              <button className="u-word-card__button" onClick={() => onSelectWord(wordId)}>
                <span className="u-word-card__text">{allWords[wordId]}</span>
                <span className="u-word-card__icon">{selectedWords[wordId] && <CheckCircleFilled />}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendSelectedWords(selectedWordsArray)}
        disabled={selectedWordsArray.length === 0}
      >
        Enviar votos
      </Button>
    </div>
  );
}

export default WordSelectionStep;
