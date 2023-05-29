// Ant Design Resources
import { Space } from 'antd';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { SuggestionEasel } from './components/SuggestionEasel';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';

type StepWaitingForGuessProps = {
  guesser: GamePlayer;
  secretWord: UeSoIssoCard;
  validSuggestions: UseSoIssoSuggestion[];
} & AnnouncementProps;

export function StepWaitingForGuess({
  guesser,
  secretWord,
  validSuggestions,
  announcement,
}: StepWaitingForGuessProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Hora de <AvatarName player={guesser} /> brilhar!
            </>
          }
          en={
            <>
              Time for <AvatarName player={guesser} /> to shine!
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={<>{guesser.name} tem uma única chance de adivinhar a palavra secreta!</>}
          en={<>{guesser.name} has a single chance to guess the secret word!</>}
        />
      </Instruction>

      <Card word={secretWord.text} />

      <Instruction contained>
        <Translate pt={<>{guesser.name} está pensando...</>} en={<>{guesser.name} is thinking...</>} />
      </Instruction>

      <Space className="u-word-guess-phase__suggestions">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
      </Space>

      {validSuggestions.length === 0 && (
        <Instruction contained>
          <Translate
            pt="Vocês eliminaram todas as dicas, super burros... coitado do(a) adivinhador(a)"
            en="Y'all eliminated all the clues! Poor guesser..."
          />
        </Instruction>
      )}
    </Step>
  );
}
