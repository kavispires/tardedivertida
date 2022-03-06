import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Components
import { AvatarName, Instruction, ReadyPlayersBar, Step, Title, Translate } from 'components';
import { SuggestionEasel } from './SuggestionEasel';
import { WritingRules } from './RulesBlobs';
import { UeSoIssoCard as Card } from './UeSoIssoCard';

type StepSuggestionProps = {
  guesser: GamePlayer;
  onSendSuggestions: GenericFunction;
  secretWord: UeSoIssoCard;
  suggestionsNumber?: number;
  players: GamePlayers;
};

export function StepSuggestion({
  guesser,
  onSendSuggestions,
  secretWord,
  players,
  suggestionsNumber = 1,
}: StepSuggestionProps) {
  const [suggestions, setSuggestions] = useState([]);

  const onChangeInput = (e: any) => {
    const { id, value } = e.target;
    if (id && value?.length > 1) {
      const indexStr = id.split('-')[1];
      const index = Number(indexStr) - 1;
      setSuggestions((s: any) => {
        const newState = { ...s };
        newState[index] = value.toUpperCase().trim();
        return newState;
      });
    }
  };

  const suggestionsValues = Object.values(suggestions);

  // On enter in the easel if only one suggestion is necessary
  const onPressEnter = () => {
    if (suggestionsNumber === suggestionsValues.length) {
      onSendSuggestions({ suggestions: suggestionsValues });
    }
  };

  return (
    <Step fullWidth>
      <Title>
        <Translate
          pt={
            <>
              Escreva uma dica para <AvatarName player={guesser} />
            </>
          }
          en={
            <>
              Write a clue for <AvatarName player={guesser} />
            </>
          }
        />
      </Title>

      <WritingRules />

      <Card word={secretWord.text} />

      {suggestionsNumber > 1 && (
        <Instruction contained>
          <Translate
            pt={
              <>Já que esse jogo tem menos jogadores, você tem que escrever {suggestionsNumber} sugestões</>
            }
            en={<>Since we have fewer players you must write {suggestionsNumber} clues</>}
          />
        </Instruction>
      )}

      <Space className="u-word-suggestion-step__inputs">
        {Array(suggestionsNumber)
          .fill(1)
          .map((entry, index) => {
            const id = `suggestion-${entry + index}`;
            return (
              <SuggestionEasel key={id} id={id} onChangeInput={onChangeInput} onPressEnter={onPressEnter} />
            );
          })}
      </Space>

      <Space className="u-word-suggestion-step__submit">
        <Button
          icon={<CloudUploadOutlined />}
          type="primary"
          onClick={() => onSendSuggestions({ suggestions: suggestionsValues })}
          disabled={suggestionsValues.length < suggestionsNumber}
          size="large"
        >
          <Translate pt="Enviar dica" en="Send clue" />
          {suggestionsNumber > 1 && 's'}
        </Button>
      </Space>

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
