// Ant Design Resources
import { Space } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { SuggestionEasel } from './components/SuggestionEasel';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { GroupProgress } from './components/GroupProgress';
import { WrongGuessHighlight } from './components/Highlights';
import { VIPNextPhaseButton } from 'components/vip';

type StepResultProps = {
  guess: string;
  guesser: GamePlayer;
  secretWord: UeSoIssoCard;
  validSuggestions: UseSoIssoSuggestion[];
  suggestions: UseSoIssoSuggestion[];
  group: GroupProgress;
} & AnnouncementProps;

export function StepResult({
  guess,
  guesser,
  secretWord,
  validSuggestions,
  suggestions,
  group,
  announcement,
}: StepResultProps) {
  const isPass = group.attempts.at(-1) === 'PASS';
  return (
    <Step fullWidth announcement={announcement}>
      <Title className={getAnimationClass('heartBeat')}>
        {isPass ? (
          <Translate
            pt={
              <>
                <AvatarName player={guesser} addressUser size="large" /> passou...
              </>
            }
            en={
              <>
                <AvatarName player={guesser} addressUser size="large" /> passed...
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                <AvatarName player={guesser} addressUser size="large" /> disse{' '}
                <TextHighlight>{guess}</TextHighlight>
              </>
            }
            en={
              <>
                <AvatarName player={guesser} addressUser size="large" /> said{' '}
                <TextHighlight>{guess}</TextHighlight>
              </>
            }
          />
        )}
      </Title>

      <Card word={secretWord.text} />

      <GroupProgress group={group} />

      <Instruction contained>
        <Translate
          pt={
            <>
              Lembre-se que vocês o objetivo é conseguir <PointsHighlight>7 pontos</PointsHighlight> em até 10
              rodadas, mas vocês perdem imediatamente se tiverem
              <WrongGuessHighlight>3 erros</WrongGuessHighlight>.
              <br />
              Vocês ganham <PointsHighlight type="positive">2 pontos</PointsHighlight> para cada acerto e
              perdem
              <PointsHighlight type="negative">1 ponto</PointsHighlight> para cada erro.
            </>
          }
          en={
            <>
              Remember that the gol is to get <PointsHighlight>7 points</PointsHighlight> within 10 rounds,
              but you immediately lose if you get
              <WrongGuessHighlight>3 errors</WrongGuessHighlight>.
              <br />
              You gain <PointsHighlight type="positive">2 points</PointsHighlight> for each correct guess and
              lose
              <PointsHighlight type="negative">1 point</PointsHighlight> for each mistake.
            </>
          }
        />
      </Instruction>

      <Title size="x-small" className="margin">
        <Translate pt="Dicas válidas" en="Valid clues" />
      </Title>

      <Space className="space-container" wrap>
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
      </Space>

      {validSuggestions.length !== suggestions.length && (
        <div className="u-margin">
          <Title size="x-small" className="margin">
            <Translate pt="Todas as dicas" en="All clues" />
          </Title>

          <Space className="space-container u-all-suggestions" wrap>
            {suggestions.map((suggestionEntry, index) => {
              const id = `all-${suggestionEntry.suggestion}-${index}`;
              return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
            })}
          </Space>
        </div>
      )}

      <VIPNextPhaseButton />
    </Step>
  );
}
