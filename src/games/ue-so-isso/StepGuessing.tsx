// Ant Design Resources
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
import type { Suggestion } from './utils/types';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Guess } from './components/Guess';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepGuessingProps = {
  guesser: GamePlayer;
  onSendGuess: GenericFunction;
  onSubmitOutcome: GenericFunction;
  validSuggestions: Suggestion[];
} & Pick<StepProps, 'announcement'>;

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
      <RuleInstruction type="rule">
        <Translate
          pt="Você tem uma única chance de adivinhar a palavra secreta!"
          en="You have a single chance to guess the secret word!"
        />
      </RuleInstruction>

      <Card word={<QuestionCircleOutlined />} />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Escreva</strong> sua adivinhação abaixo.
              <br />
              Se você acertar, o grupo ganha <PointsHighlight type="positive">2 pontos</PointsHighlight> mas
              se você errar, o grupo perde <PointsHighlight type="negative">1 ponto</PointsHighlight>.
              <br />
              Você pode pular se não estiver se sentindo seguro.
            </>
          }
          en={
            <>
              <strong>Write</strong> your guess below.
              <br />
              If you get it right, the group wins <PointsHighlight type="positive">
                2 points
              </PointsHighlight>{' '}
              but if you get it wrong, the group loses{' '}
              <PointsHighlight type="negative">1 point</PointsHighlight>.
              <br />
              You can skip if you're not feeling confident.
            </>
          }
        />
      </RuleInstruction>

      <Guess onSubmitOutcome={onSubmitOutcome} onSendGuess={onSendGuess} />

      <Space className="u-word-guess-phase__suggestions">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
        {validSuggestions.length === 0 && (
          <RuleInstruction type="alert">
            <Translate
              pt="Seus companheiros eliminaram todas as dicas, super burros..."
              en="All clues were eliminated! Good luck..."
            />
          </RuleInstruction>
        )}
      </Space>
    </Step>
  );
}
