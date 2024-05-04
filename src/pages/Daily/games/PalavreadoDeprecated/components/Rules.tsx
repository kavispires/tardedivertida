import { Typography } from 'antd';
import { Translate } from 'components/language';
import { BetaBanner } from 'pages/Daily/components/BetaBanner';
import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <Typography>
      <BetaBanner />
      <Translate
        pt={
          <>
            <li>
              Existe uma palavra secreta de {SETTINGS.WORD_LENGTH} letras. Você tem {SETTINGS.HEARTS} chances
              de tentar acertá-la.
            </li>
            <li>Digite uma palavra de 5 letras e aperte Enter.</li>
            <li>Se a letra se tornar verde é porque a letra está presente e na posição correta.</li>
            <li>Se a letra se tornar amarela é porque a letra está presente, mas na posição errada.</li>
            <li>Boa sorte!</li>
          </>
        }
        en={
          <>
            <li>
              There is a secret word with {SETTINGS.WORD_LENGTH} letters. You have {SETTINGS.HEARTS} chances
              to try to guess it.
            </li>
            <li>Type a 5-letter word and press Enter.</li>
            <li>
              If the letter turns green it is because the letter is present and in the correct position.
            </li>
            <li>
              If the letter turns yellow it is because the letter is present, but in the wrong position.
            </li>
            <li>Good luck!</li>
          </>
        }
      />
    </Typography>
  );
}
