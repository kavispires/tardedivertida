import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { TextCardData } from 'types/tdr';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitVotesPayload } from './utils/types';

type StepWordSelectionProps = {
  guesser: GamePlayer;
  onSendSelectedWords: (payload: SubmitVotesPayload) => void;
  words: TextCardData[];
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
  const [selectedWords, setSelectedWords] = useState<Dictionary<boolean>>({});

  const selectedWordsArray = Object.keys(selectedWords);
  const noSelection = selectedWordsArray.length === 0;

  const autoSelectRandomWord = () => {
    const randomSelection = words[0].id;
    onSendSelectedWords({
      votes: {
        [randomSelection]: 1,
      },
    });
  };

  const onSelectWord = (wordId: string) => {
    setSelectedWords((s: Dictionary<boolean>) => {
      const newState = { ...s };
      if (newState[wordId]) {
        delete newState[wordId];
      } else {
        newState[wordId] = true;
      }
      return newState;
    });
  };

  const handleSubmitSelectedWords = () => {
    const votes: Record<string, number> = {};
    if (selectedWordsArray.length === 0) {
      // If no words are selected, send the first word with weight 1
      votes[words[0].id] = 1;
    } else if (selectedWordsArray.length === 1) {
      // If one word is selected, send it with weight 3
      votes[selectedWordsArray[0]] = 3;
    } else {
      // If multiple words are selected, send them with weight 2
      selectedWordsArray.forEach((wordId) => {
        votes[wordId] = 2;
      });
    }
    onSendSelectedWords({ votes });
  };

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Selecione a Palavra Secreta para {guesser}"
          en="Select a Secret Word for {guesser}"
          values={{
            guesser: <PlayerAvatarName player={guesser} />,
          }}
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          en="The word with the most votes will be selected for the round. <br/> <strong>You can choose as many as you wish!</strong> <br/> If you fail to select any of them, the first one will be submitted as your choice."
          pt="A palavra com mais votos será escolhida para essa rodada. <br/> <strong>Você pode selecionar quantas quiser!</strong> <br/> Se você não selecionar nenhuma, a primeira palavra será enviada como sua escolha."
        />
      </RuleInstruction>

      <ul className="u-word-card">
        {words.map((word) => {
          return (
            <li
              className="u-word-card__word"
              key={word.id}
            >
              <button
                type="button"
                className="u-word-card__button"
                onClick={() => onSelectWord(word.id)}
              >
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
        onClick={handleSubmitSelectedWords}
        disabled={noSelection}
        onExpire={autoSelectRandomWord}
        duration={30}
        hideTimer={!noSelection}
      >
        <Translate
          pt="Enviar votos"
          en="Send votes"
        />
      </TimedButton>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={guesser.id}
        className="u-margin"
      />
    </Step>
  );
}
