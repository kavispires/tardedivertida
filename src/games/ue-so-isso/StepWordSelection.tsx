import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitVotesPayload } from './utils/types';

type StepWordSelectionProps = {
  guesser: GamePlayer;
  onSendSelectedWords: (payload: SubmitVotesPayload) => void;
  words: TextCard[];
  players: GamePlayers;
  turnOrder: TurnOrder;
} & Pick<StepProps, 'announcement'>;

export function StepWordSelection({
  guesser,
  onSendSelectedWords,
  announcement,
  words = [],
  players,
  turnOrder,
}: StepWordSelectionProps) {
  const [selectedWords, setSelectedWords] = useState<BooleanDictionary>({});

  const selectedWordsArray = Object.keys(selectedWords);
  const noSelection = selectedWordsArray.length === 0;

  const autoSelectRandomWord = () => {
    const randomSelection = words[0].id;
    onSendSelectedWords({ votes: [randomSelection] });
  };

  const onSelectWord = (wordId: string) => {
    setSelectedWords((s: BooleanDictionary) => {
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
      <StepTitle>
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
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              A palavra com mais votos será escolhida para essa rodada.
              <br />
              <strong>Você pode selecionar quantas quiser!</strong>
              <br />
              Se você não selecionar nenhuma, a primeira palavra será enviada como sua escolha.
            </>
          }
          en={
            <>
              The word with the most votes will be selected for the round.
              <br />
              <strong>You can choose as many as you wish!</strong>
              <br />
              If you fail to select any of them, the first one will be submitted as your choice.
            </>
          }
        />
      </RuleInstruction>

      <ul className="u-word-card">
        {words.map((word) => {
          return (
            <li className="u-word-card__word" key={word.id}>
              <button type="button" className="u-word-card__button" onClick={() => onSelectWord(word.id)}>
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
