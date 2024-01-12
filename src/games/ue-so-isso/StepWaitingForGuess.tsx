// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
import type { Suggestion } from './utils/types';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepWaitingForGuessProps = {
  guesser: GamePlayer;
  secretWord: TextCard;
  validSuggestions: Suggestion[];
} & Pick<StepProps, 'announcement'>;

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

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              {guesser.name} tem uma única chance de adivinhar a palavra secreta!
              <br />
              Se acertar, o grupo ganha <PointsHighlight type="positive">2 pontos</PointsHighlight> mas se
              errar, o grupo perde <PointsHighlight type="negative">1 pontos</PointsHighlight>.
              <br />
              Há a opção de pular a rodada, mas só faz o grupo perder tempo.
            </>
          }
          en={
            <>
              {guesser.name} has a single chance to guess the secret word!
              <br />
              If they get it right, the group wins <PointsHighlight type="positive">
                2 points
              </PointsHighlight>{' '}
              but if they get it wrong, the group loses{' '}
              <PointsHighlight type="negative">1 points</PointsHighlight>.
              <br />
              There's the option to skip the round, but it only wastes time.
            </>
          }
        />
      </RuleInstruction>

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
        <RuleInstruction type="alert">
          <Translate
            pt="Vocês eliminaram todas as dicas, super burros... coitado do(a) adivinhador(a)"
            en="Y'all eliminated all the clues! Poor guesser..."
          />
        </RuleInstruction>
      )}
    </Step>
  );
}
