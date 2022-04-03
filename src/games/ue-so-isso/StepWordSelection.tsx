import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Components
import { AvatarName, Instruction, Step, TimedButton, Title, Translate } from 'components';

type StepWordSelectionProps = {
  guesser: GamePlayer;
  onSendSelectedWords: GenericFunction;
  words: UeSoIssoCard[];
};

export function StepWordSelection({ guesser, onSendSelectedWords, words = [] }: StepWordSelectionProps) {
  const [selectedWords, setSelectedWords] = useState<PlainObject>({});

  const selectedWordsArray = Object.keys(selectedWords);
  const noSelection = selectedWordsArray.length === 0;

  const autoSelectRandomWord = () => {
    const randomSelection = words[0].id;
    onSendSelectedWords({ votes: [randomSelection] });
  };

  const onSelectWord = (wordId: string) => {
    setSelectedWords((s: PlainObject) => {
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
    <Step fullWidth>
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
                <span className="u-word-card__icon">
                  {Boolean(selectedWords[word.id]) && <CheckCircleFilled />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <TimedButton
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendSelectedWords({ votes: selectedWordsArray })}
        disabled={noSelection}
        onExpire={autoSelectRandomWord}
        duration={15}
        showTimer={noSelection}
      >
        <Translate pt="Enviar votos" en="Send votes" />
      </TimedButton>
    </Step>
  );
}
