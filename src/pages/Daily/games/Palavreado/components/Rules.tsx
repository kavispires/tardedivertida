// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language/Translate';
// Pages
import { RulesWrapper } from 'pages/Daily/components/RulesWrapper';
// Internal
import { SETTINGS } from '../utils/settings';

type RulesProps = {
  date: string;
};

export function Rules({ date }: RulesProps) {
  return (
    <RulesWrapper
      date={date}
      basicRules={getRulesSet(false)}
      weekendRules={getRulesSet(true)}
    />
  );
}

const getRulesSet = (isWeekend: boolean) => {
  const value = isWeekend ? 1 : 0;
  return (
    <Translate
      pt={
        <>
          <li>
            Junto à palavra-chave de {SETTINGS.WORD_LENGTH + value} letras diagonal na grade existem{' '}
            {SETTINGS.HEARTS + value} palavras embaralhadas horizontalmente.
          </li>
          <li>
            Você precisa ordenar as letras para formar as {SETTINGS.HEARTS + value} palavras horizontais.
          </li>
          <li>Selecione uma letra e depois uma outra para que elas troquem de lugar.</li>
          <li>Quando você acha que a grade está certa, aperte "Enviar".</li>
          <li>
            Todas as letras colocadas na posição corretas serão coloridas da cor da linha. Mas se você não
            acertas todas, você perde um <HeartFilled />.
          </li>
          <li>
            <strong>
              Você ganha pontos igual ao número de corações para cada letra correta!
              <br />
              Você ganha {SETTINGS.WORD_SCORE} pontos quando complete a palavra.
              <br />E se você cria uma palavra das palavras secretas, você ganha {SETTINGS.SECRET_WORD_SCORE}{' '}
              pontos adicionais, mesmo não sendo a palavra correta.
            </strong>
          </li>
          <li>
            Você tem {SETTINGS.HEARTS + value} <HeartFilled /> chances. Boa sorte!
          </li>
        </>
      }
      en={
        <>
          <li>
            Next to the {SETTINGS.WORD_LENGTH + value}-letter keyword diagonally in the grid are{' '}
            {SETTINGS.HEARTS + value} shuffled words.
          </li>
          <li>You need to order the letters to form the {SETTINGS.HEARTS + value} words in the rows.</li>
          <li>Select a letter and then another so they swap places.</li>
          <li>When you think the grid is correct, press "Submit".</li>
          <li>
            All letters placed in the correct position will be colored in the line color. But if you don't get
            them all, you lose a <HeartFilled />.
          </li>
          <li>
            You earn points equal to the number of hearts for each correct letter!
            <br />
            You earn {SETTINGS.WORD_SCORE} points when you complete a word.
            <br />
            And if you create a word from the secret words, you earn {SETTINGS.SECRET_WORD_SCORE} additional
            points, even if it's not the correct word.
          </li>
          <li>
            You have {SETTINGS.HEARTS + value} <HeartFilled /> chances. Good luck!
          </li>
        </>
      }
    />
  );
};
