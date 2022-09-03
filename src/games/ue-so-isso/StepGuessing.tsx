// Ant Design Resources
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Components

import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Guess } from './components/Guess';
import { SuggestionEasel } from './components/SuggestionEasel';
import { Step } from 'components/steps';
import { ViewOr } from 'components/views';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';

type StepGuessingProps = {
  guesser: GamePlayer;
  isUserTheGuesser: boolean;
  secretWord: UeSoIssoCard;
  onSendGuess: GenericFunction;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
};

export function StepGuessing({
  guesser,
  isUserTheGuesser,
  secretWord,
  onSendGuess,
  onSubmitOutcome,
  validSuggestions,
}: StepGuessingProps) {
  return (
    <Step fullWidth>
      <ViewOr orCondition={isUserTheGuesser}>
        <Space direction="vertical" align="center">
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
          </Space>
        </Space>

        <Space direction="vertical" align="center">
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
            {guesser.name}{' '}
            <Translate
              pt="tem uma única chance de adivinhar a palavra secreta!"
              en="has a single chance to guess the secret word!"
            />
          </Instruction>

          <Card word={secretWord.text} />

          <Instruction contained>
            {guesser.name} <Translate pt="está pensando..." en="is thinking..." />
          </Instruction>

          <Space className="u-word-guess-phase__suggestions">
            {validSuggestions.map((suggestionEntry, index) => {
              const id = `${suggestionEntry.suggestion}-${index}`;
              return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
            })}
          </Space>
        </Space>
      </ViewOr>
    </Step>
  );
}
