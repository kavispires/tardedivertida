// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
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
      additionalRules={
        <Translate
          pt={
            <>
              <strong>Dicas:</strong>
              <li>
                Para entender melhor as regras de cada círculo, clique no botão "Entenda as regras
                gramaticais"
              </li>
            </>
          }
          en={
            <>
              <strong>Tips:</strong>
              <li>
                To better understand the rules of each circle, click the "Understand the grammar rules" button
              </li>
            </>
          }
        />
      }
    />
  );
}

const getRulesSet = (isWeekend: boolean) => {
  const quantity = SETTINGS.HEARTS + (isWeekend ? 1 : 0);
  return (
    <Translate
      pt={
        <>
          <li>Existem dois círculos conectados formando um diagrama com uma intercessão.</li>
          <li>
            Cada um dos dois círculo possui uma regra gramatical secreta que pode ir desde "Começa com B" ou
            "Tem três sílabas" ou "Tem mais consoantes que vogais", etc.
          </li>
          <li>
            Para começar, existe uma "coisa" em cada uma das áreas do diagrama. A coisa na área central
            obedece a regra do círculo amarelo e a do vermelho, enquanto a coisa em só um lado obedece somente
            a regra daquele círculo. Teoria de conjuntos básica! Matemática 5a série.
          </li>
          <li>O objetivo é você colocar {quantity} coisas, uma a uma, na área correta do diagrama.</li>
          <li>
            Se você colocar uma coisa na área errada, o jogo vai colocar a coisa na área correta, você perde
            um coração <HeartFilled />, e ganha uma nova coisa para posicionar.
          </li>
          <li>
            Você tem {quantity} <HeartFilled /> chances. Boa sorte!
          </li>
        </>
      }
      en={
        <>
          <li>There are two connected circles forming a diagram with an intersection.</li>
          <li>
            Each of the two circles has a secret grammar rule that can range from "Starts with B" or "Has
            three syllables" or "Has more consonants than vowels"
          </li>
          <li>
            To start, there is a "thing" in each of the diagram areas. The thing in the central area obeys the
            rule of the yellow circle and the red one, while the thing on just one side obeys only the rule of
            that circle. Basic set theory! 5th grade math.
          </li>
          <li>
            The goal is for you to place {quantity} things, one by one, in the correct area of the diagram.
          </li>
          <li>
            If you place a thing in the wrong area, the game will place the thing in the correct area, you
            lose a heart <HeartFilled />, and gain a new thing to position.
          </li>
          <li>
            You have {quantity} <HeartFilled /> chances. Good luck!
          </li>
        </>
      }
    />
  );
};
