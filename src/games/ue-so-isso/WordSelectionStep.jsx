import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Components
import { Instruction, Step, TimedButton, Title, translate, Translate } from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import { useLanguage } from '../../hooks';

function WordSelectionStep({ guesser, onSendSelectedWords, words = [] }) {
  const [selectedWords, setSelectedWords] = useState({});
  const language = useLanguage();

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
        <Translate
          pt={
            <>
              Selecione a Palavra Secreta para <AvatarName player={guesser} />
            </>
          }
          en={
            <>
              {' '}
              Select a Secret Word for <AvatarName player={guesser} />
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              A palavra com mais votos será escolhida para essa rodada. Você pode selecionar quantas quiser!
            </>
          }
          en={
            <>
              The word with the most votes will be selected for the round. You can choose as many as you wish!
            </>
          }
        />
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
        label={translate('Enviar votos', 'Send votes', language)}
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
