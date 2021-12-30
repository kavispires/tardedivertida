// Design Resources
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Components
import { AvatarName, Instruction, Step, Title, Translate, ViewIf } from '../../components';
import Card from './UeSoIssoCard';
import Guess from './Guess';
import SuggestionEasel from './SuggestionEasel';

type StepGuessingProps = {
  guesser: GamePlayer;
  isUserTheGuesser: boolean;
  secretWord: UeSoIssoCard;
  onSendGuess: GenericFunction;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
};

function StepGuessing({
  guesser,
  isUserTheGuesser,
  secretWord,
  onSendGuess,
  onSubmitOutcome,
  validSuggestions,
}: StepGuessingProps) {
  return (
    <Step>
      <ViewIf isVisible={isUserTheGuesser}>
        <Title>
          <Translate pt="Hora de brilhar" en="Time to shine" />, <AvatarName player={guesser} />!
        </Title>
        <Instruction contained>
          <Translate
            pt="Você tem uma única change de adivinhar a palavra secreta!"
            en="You have a single chance to guess the secret word!"
          />
        </Instruction>

        <Card word={<QuestionCircleOutlined />} />

        <Instruction contained>
          <Translate pt="Escreva seu chute no campo abaixo" en="Write your guess below" />
        </Instruction>
        <Guess onSubmitOutcome={onSubmitOutcome} onSendGuess={onSendGuess} />

        <Space className="u-word-guess-phase__suggestions">
          {validSuggestions.map((suggestionEntry, index) => {
            const id = `${suggestionEntry.suggestion}-${index}`;
            return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
          })}
        </Space>
      </ViewIf>

      <ViewIf isVisible={!isUserTheGuesser}>
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
      </ViewIf>
    </Step>
  );
}

export default StepGuessing;
