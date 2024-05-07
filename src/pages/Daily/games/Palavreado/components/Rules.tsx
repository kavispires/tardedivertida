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
              Junto à palavra-chave de {SETTINGS.WORD_LENGTH} letras diagonal na grade existem{' '}
              {SETTINGS.HEARTS} palavras embaralhadas.
            </li>
            <li>Você precisa ordenar as letras para formar as {SETTINGS.HEARTS} palavras.</li>
            <li>Selecione uma letra e depois uma outra para que elas troquem de lugar.</li>
            <li>Quando você acha que a grade está certa, aperte "Enviar".</li>
            <li>
              Todas as letras colocadas na posição corretas serão coloridas da corta da linha. Mas se você não
              acertas todas, você perde um <HeartFilled />.
            </li>
            <li>
              Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
            </li>
          </>
        }
        en={
          <>
            <li>
              Next to the {SETTINGS.WORD_LENGTH}-letter keyword diagonally in the grid are {SETTINGS.HEARTS}{' '}
              shuffled words.
            </li>
            <li>You need to order the letters to form the {SETTINGS.HEARTS} words.</li>
            <li>Select a letter and then another so they swap places.</li>
            <li>When you think the grid is correct, press "Submit".</li>
            <li>
              All letters placed in the correct position will be colored in the line color. But if you don't
              get them all, you lose a <HeartFilled />.
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
