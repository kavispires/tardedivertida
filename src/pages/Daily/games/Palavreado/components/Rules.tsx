import { Typography } from 'antd';
import { Translate } from 'components/language';
import { BetaBanner } from 'pages/Daily/components/BetaBanner';

import { HeartFilled } from '@ant-design/icons';

import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <Typography>
      <BetaBanner />
      <Translate
        pt={
          <>
            <li>
              Existem {SETTINGS.HEARTS} palavras de {SETTINGS.WORD_LENGTH} letras completamente embaralhadas.
            </li>
            <li>Selecione as letras que você acha que formam uma das palavras e aperte Enviar.</li>
            <li>Se você acertou, as letras são posicionadas no topo da grade.</li>
            <li>
              Se você errou, você perde uma <HeartFilled />, mas as letras corretas se tornarão da cor da
              palavra que você acertou mais letras na posição correta.
            </li>
            <li>
              Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
            </li>
          </>
        }
        en={
          <>
            <li>
              There are {SETTINGS.HEARTS} {SETTINGS.WORD_LENGTH}-letter words completely scrambled.
            </li>
            <li>Select the letters you think form one of the words and press submit</li>
            <li>If you guessed right, the letters are placed at the top of the grid.</li>
            <li>
              If you guessed wrong, you lose a <HeartFilled />, but the correct letters will turn the color of
              the word you guessed more letters in the correct position.
            </li>
            <li>
              You have {SETTINGS.HEARTS} <HeartFilled /> chances. Good luck!
            </li>
          </>
        }
      />
    </Typography>
  );
}
