// Ant Design Resources
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { mockSuggestions } from './utils/mock';
// Components
import { SuggestionEasel } from './components/SuggestionEasel';
import { WritingRules } from './components/RulesBlobs';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ReadyPlayersBar } from 'components/players';
import { ControlledInputWriting } from 'components/input';

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
  useMock(() => {
    onSendSuggestions(mockSuggestions(suggestionsNumber));
  }, []);

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

      <ControlledInputWriting
        onSubmit={onSendSuggestions}
        inputComponent={SuggestionEasel}
        valueKey="suggestions"
        inputQuantity={suggestionsNumber}
        submitButtonLabel={
          <>
            <Translate pt="Enviar dica" en="Send clue" />
            {suggestionsNumber > 1 && 's'}
          </>
        }
        submitButtonProps={{
          icon: <CloudUploadOutlined />,
          size: 'large',
        }}
      />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
