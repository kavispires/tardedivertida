import { motion } from 'motion/react';
// Types
import type { GamePlayer } from 'types/game';
// Utils
import { getAnimation } from '@utils/animations';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { SecretWord } from '../utils/types';

type HintProps = {
  isTheGuesser: boolean;
  guesser: GamePlayer;
  secretWord: SecretWord;
  hintsEnabled: boolean;
  showFirstHint: boolean;
  showSecondHint: boolean;
};

export function Hint({
  isTheGuesser,
  guesser,
  secretWord,
  hintsEnabled,
  showFirstHint,
  showSecondHint,
}: HintProps) {
  const firstHint =
    hintsEnabled && showFirstHint ? (
      <>
        <br />
        <motion.span {...getAnimation('fadeIn')}>
          <Translate
            pt="<strong>Dica 1</strong>: A palavra tem <letters>letras</letters>"
            en="<strong>Hint 1</strong>: The word has <letters>letters</letters>"
            values={{
              letters: (content) => (
                <TextHighlight>
                  {secretWord.text.length} {content}
                </TextHighlight>
              ),
            }}
          />
        </motion.span>
      </>
    ) : null;

  const secondHint =
    hintsEnabled && showSecondHint ? (
      <>
        <br />
        <motion.span {...getAnimation('fadeIn')}>
          <Translate
            pt="<strong>Dica 2</strong>: A palavra começa com {letter}"
            en="<strong>Hint 2</strong>: The word starts with {letter}"
            values={{
              letter: <TextHighlight>{secretWord.text[0]}</TextHighlight>,
            }}
          />
        </motion.span>
      </>
    ) : null;

  if (!isTheGuesser) {
    return (
      <RuleInstruction type={showFirstHint || showSecondHint ? 'event' : 'wait'}>
        <Translate
          pt="{guesser} está pensando..."
          en="{guesser} is thinking..."
          values={{ guesser: guesser.name }}
        />
        {firstHint}
        {secondHint}
      </RuleInstruction>
    );
  }

  return (
    <RuleInstruction type="rule">
      <Translate
        pt="Você tem uma única chance de adivinhar a palavra secreta!"
        en="You have a single chance to guess the secret word!"
      />
      {firstHint}
      {secondHint}
    </RuleInstruction>
  );
}
