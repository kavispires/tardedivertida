import { motion } from 'framer-motion';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { Translate } from 'components/language';
import { RuleInstruction, TextHighlight } from 'components/text';
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
            pt={
              <>
                <strong>Dica 1</strong>: A palavra tem{' '}
                <TextHighlight>{secretWord.text.length} letras</TextHighlight>
              </>
            }
            en={
              <>
                <strong>Hint 1</strong>: The word has{' '}
                <TextHighlight>{secretWord.text.length} letters</TextHighlight>
              </>
            }
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
            pt={
              <>
                <strong>Dica 2</strong>: A palavra começa com{' '}
                <TextHighlight>{secretWord.text[0]}</TextHighlight>
              </>
            }
            en={
              <>
                <strong>Hint 2</strong>: The word starts with{' '}
                <TextHighlight>{secretWord.text[0]}</TextHighlight>
              </>
            }
          />
        </motion.span>
      </>
    ) : null;

  if (!isTheGuesser) {
    return (
      <RuleInstruction type={showFirstHint || showSecondHint ? 'event' : 'wait'}>
        <Translate pt={<>{guesser.name} está pensando...</>} en={<>{guesser.name} is thinking...</>} />
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
