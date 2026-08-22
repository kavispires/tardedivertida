// Types
import type { GamePlayer, GameRound } from 'types/game';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { SuggestionEasel } from '@components/game-elements/SuggestionEasel';
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
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
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepResult({
  guess,
  guesser,
  secretWord,
  validSuggestions,
  suggestions,
  group,
  announcement,
  round,
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
            pt="{guesser} passou..."
            en="{guesser} passed..."
            values={{
              guesser: (
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />
              ),
            }}
          />
        ) : (
          <Translate
            pt="{guesser} disse {guess}"
            en="{guesser} said {guess}"
            values={{
              guesser: (
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />
              ),
              guess: <TextHighlight>{guess}</TextHighlight>,
            }}
          />
        )}
      </StepTitle>

      <Card word={secretWord.text} />

      <GroupProgress group={group} />

      <RuleInstruction type="rule">
        <Translate
          pt="Lembre-se que vocês o objetivo é conseguir {goalPoints} em até 10 rodadas, mas vocês perdem imediatamente se tiverem <wrongGuesses>erros</wrongGuesses>.
          <br/>
          Vocês ganham {positivePoints} para cada acerto e perdem {negativePoint} para cada erro."
          en="Remember that the goal is to get {goalPoints} within 10 rounds, but you immediately lose if you get <wrongGuesses>errors</wrongGuesses>.
          <br/>
          You gain {positivePoints} for each correct guess and lose {negativePoint} for each mistake."
          values={{
            goalPoints: <PointsHighlight value={7} />,
            wrongGuesses: (content) => <WrongGuessHighlight>3 {content}</WrongGuessHighlight>,
            positivePoints: (
              <PointsHighlight
                type="positive"
                value={2}
              />
            ),
            negativePoint: (
              <PointsHighlight
                type="negative"
                value={1}
              />
            ),
          }}
        />
      </RuleInstruction>

      <TitledContainer
        wrap
        title={
          <Translate
            pt="Dicas válidas"
            en="Valid clues"
          />
        }
      >
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
      </TitledContainer>

      <HostNextPhaseButton
        withWaitingTimeBar
        round={round}
      />

      {validSuggestions.length !== suggestions.length && (
        <TitledContainer
          className="u-all-suggestions"
          wrap
          title={
            <Translate
              pt="Todas as dicas"
              en="All clues"
            />
          }
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
        </TitledContainer>
      )}
    </Step>
  );
}
