import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { TurnOrder } from 'components/players';

type StepWordSelectionProps = {
  guesser: GamePlayer;
  onSendSelectedWords: GenericFunction;
  words: UeSoIssoCard[];
  players: GamePlayers;
  turnOrder: TurnOrder;
} & AnnouncementProps;

export function StepWordSelection({
  guesser,
  onSendSelectedWords,
  announcement,
  words = [],
  players,
  turnOrder,
}: StepWordSelectionProps) {
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
    <Step fullWidth announcement={announcement}>
      <Title white>
        <Translate
          pt={
            <>
              Selecione a Palavra Secreta para <AvatarName player={guesser} />
            </>
          }
          en={
            <>
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
        duration={20}
        hideTimer={!noSelection}
      >
        <Translate pt="Enviar votos" en="Send votes" />
      </TimedButton>

      <TurnOrder players={players} order={turnOrder} activePlayerId={guesser.id} className="u-margin" />
    </Step>
  );
}
