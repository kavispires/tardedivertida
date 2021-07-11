import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Components
import { Instruction, Step, TimedButton, Title } from '../../shared';
import { AvatarName } from '../../avatars';

function WordSelectionStep({ guesser, onSendSelectedWords, words = [] }) {
  const [selectedWords, setSelectedWords] = useState({});

  const selectedWordsArray = Object.keys(selectedWords);
  const noSelection = selectedWordsArray.length === 0;

  const autoSelectRandomWord = () => {
    const randomSelection = words[0].id;
    onSendSelectedWords({ votes: [randomSelection] });
  };

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

  return (
    <Step>
      <Title white>
        Selecione a Palavra-Secreta para <AvatarName player={guesser} />
      </Title>

      <Instruction white>
        A palavra secreta com mais votos será escolhida para essa rodada. Você pode selecionar quantas quiser!
      </Instruction>

      <ul className="u-word-card">
        {words.map((word) => {
          return (
            <li className="u-word-card__word" key={word.id}>
              <button className="u-word-card__button" onClick={() => onSelectWord(word.id)}>
                <span className="u-word-card__text">{word.text}</span>
                <span className="u-word-card__icon">{selectedWords[word.id] && <CheckCircleFilled />}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <TimedButton
        label="Enviar votos"
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendSelectedWords({ votes: selectedWordsArray })}
        disabled={noSelection}
        onExpire={autoSelectRandomWord}
        duration={15}
        showTimer={noSelection}
      />
    </Step>
  );
}

WordSelectionStep.propTypes = {
  guesser: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
  onSendSelectedWords: PropTypes.func.isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
    })
  ),
};

export default WordSelectionStep;
