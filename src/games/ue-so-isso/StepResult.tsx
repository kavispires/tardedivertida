// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight, Title } from 'components/text';
// Internal
import type { SecretWord, Suggestion } from './utils/types';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { GroupProgress } from './components/GroupProgress';
import { WrongGuessHighlight } from './components/Highlights';

type StepResultProps = {
  guess: string;
  guesser: GamePlayer;
  secretWord: SecretWord;
  validSuggestions: Suggestion[];
  suggestions: Suggestion[];
  group: GroupProgress;
} & Pick<StepProps, 'announcement'>;

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle className={getAnimationClass('heartBeat')}>
        {isPass ? (
          <Translate
            pt={
              <>
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />{' '}
                passou...
              </>
            }
            en={
              <>
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />{' '}
                passed...
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />{' '}
                disse <TextHighlight>{guess}</TextHighlight>
              </>
            }
            en={
              <>
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />{' '}
                said <TextHighlight>{guess}</TextHighlight>
              </>
            }
          />
        )}
      </StepTitle>

      <Card word={secretWord.text} />

      <GroupProgress group={group} />

      <RuleInstruction type="rule">
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
              Remember that the goal is to get <PointsHighlight>7 points</PointsHighlight> within 10 rounds,
              but you immediately lose if you get
              <WrongGuessHighlight>3 errors</WrongGuessHighlight>.
              <br />
              You gain <PointsHighlight type="positive">2 points</PointsHighlight> for each correct guess and
              lose
              <PointsHighlight type="negative">1 point</PointsHighlight> for each mistake.
            </>
          }
        />
      </RuleInstruction>

      <Title
        size="xx-small"
        className="margin"
      >
        <Translate
          pt="Dicas válidas"
          en="Valid clues"
        />
      </Title>

      <SpaceContainer wrap>
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return (
            <SuggestionEasel
              key={id}
              id={id}
              value={suggestionEntry.suggestion}
            />
          );
        })}
      </SpaceContainer>

      {validSuggestions.length !== suggestions.length && (
        <div className="u-margin">
          <Title
            size="x-small"
            className="margin"
          >
            <Translate
              pt="Todas as dicas"
              en="All clues"
            />
          </Title>

          <SpaceContainer
            className="u-all-suggestions"
            wrap
          >
            {suggestions.map((suggestionEntry, index) => {
              const id = `all-${suggestionEntry.suggestion}-${index}`;
              return (
                <SuggestionEasel
                  key={id}
                  id={id}
                  value={suggestionEntry.suggestion}
                />
              );
            })}
          </SpaceContainer>
        </div>
      )}

      <HostNextPhaseButton />
    </Step>
  );
}
