// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';
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
    <>
      <li>
        <Translate
          en="Next to the {wordLength}-letter keyword diagonally in the grid are {hearts} shuffled words."
          pt="Junto à palavra-chave de {wordLength} letras diagonal na grade existem {hearts} palavras embaralhadas horizontalmente."
          values={{ wordLength: SETTINGS.WORD_LENGTH + value, hearts: SETTINGS.HEARTS + value }}
        />
      </li>
      <li>
        <Translate
          en="You need to order the letters to form the {hearts} words in the rows."
          pt="Você precisa ordenar as letras para formar as {hearts} palavras horizontais."
          values={{ hearts: SETTINGS.HEARTS + value }}
        />
      </li>
      <li>
        <Translate
          en="Select a letter and then another so they swap places."
          pt="Selecione uma letra e depois uma outra para que elas troquem de lugar."
        />
      </li>
      <li>
        <Translate
          en='When you think the grid is correct, press "Submit".'
          pt='Quando você acha que a grade está certa, aperte "Enviar".'
        />
      </li>
      <li>
        <Translate
          en="All letters placed in the correct position will be colored in the line color. But if you don't get them all, you lose a {icon}."
          pt="Todas as letras colocadas na posição corretas serão coloridas da cor da linha. Mas se você não acertas todas, você perde um {icon}."
          values={{ icon: <HeartFilled /> }}
        />
      </li>
      <li>
        <Translate
          en="You earn points equal to the number of hearts for each correct letter! You earn {wordScore} points when you complete a word. And if you create a word from the secret words, you earn {secretWordScore} additional points, even if it's not the correct word. But be careful, the number of swaps is subtracted from the final score!"
          pt="Você ganha pontos igual ao número de corações para cada letra correta! Você ganha {wordScore} pontos quando complete a palavra. E se você cria uma palavra das palavras secretas, você ganha {secretWordScore} pontos adicionais, mesmo não sendo a palavra correta. Mas cuidado, o número de trocas é subtraído da pontuação final!"
          values={{ wordScore: SETTINGS.WORD_SCORE, secretWordScore: SETTINGS.SECRET_WORD_SCORE }}
        />
      </li>
      <li>
        <Translate
          en="You have {hearts} {icon} chances. Good luck!"
          pt="Você tem {hearts} {icon} chances. Boa sorte!"
          values={{ hearts: SETTINGS.HEARTS + value, icon: <HeartFilled /> }}
        />
      </li>
      <li>
        <Translate
          en="Good luck!"
          pt="Boa sorte!"
        />
      </li>
      <li>
        <Translate
          en="Have fun!"
          pt="Divirta-se!"
        />
      </li>
      <li>
        <Translate
          en="And remember: the goal is to have fun, not to win."
          pt="E lembre-se: o objetivo é se divertir, não ganhar."
        />
      </li>
    </>
  );
};
