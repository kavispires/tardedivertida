// Ant Design Resources
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Guess } from './components/Guess';
import { SuggestionEasel } from './components/SuggestionEasel';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';

type StepGuessingProps = {
  guesser: GamePlayer;
  onSendGuess: GenericFunction;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
} & AnnouncementProps;

export function StepGuessing({
  guesser,
  onSendGuess,
  onSubmitOutcome,
  validSuggestions,
  announcement,
}: StepGuessingProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Hora de brilhar" en="Time to shine" />, <AvatarName player={guesser} />!
      </Title>
      <Instruction contained>
        <Translate
          pt="Você tem uma única chance de adivinhar a palavra secreta!"
          en="You have a single chance to guess the secret word!"
        />
      </Instruction>

      <Card word={<QuestionCircleOutlined />} />

      <Instruction contained>
        <Translate pt="Escreva seu palpite no campo abaixo" en="Write your guess below" />
      </Instruction>

      <Guess onSubmitOutcome={onSubmitOutcome} onSendGuess={onSendGuess} />

      <Space className="u-word-guess-phase__suggestions">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
        {validSuggestions.length === 0 && (
          <Instruction contained>
            <Translate
              pt="Seus companheiros eliminaram todas as dicas, super burros..."
              en="All clues were eliminated! Good luck..."
            />
          </Instruction>
        )}
      </Space>
    </Step>
  );
}
