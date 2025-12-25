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
      basicRules={
        <Translate
          pt={
            <>
              <li>Você está diante a portais com imagens fantásticas.</li>
              <li>
                Organize as palavras de 3 letras até formar a palavra-chave que corresponde à similaridade
                entre os portais.
              </li>
              <li>Quando você acerta uma letra, ela se trava em amarelo até você acertar a palavra-chave.</li>
              <li>Você tem que passar por 3 corredores de portas.</li>
              <li>
                Cada tentativa errada remove um coração <HeartFilled />.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled />. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>You are facing portals with fantastic images.</li>
              <li>
                Organize the 3-letter words until you form the keyword that corresponds to the similarity
                between the portals.
              </li>
              <li>When you hit a letter, it locks in yellow until you hit the keyword.</li>
              <li>You have to go through 3 corridors of doors.</li>
              <li>
                Each wrong attempt removes a heart <HeartFilled />.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled />. Good luck!
              </li>
            </>
          }
        />
      }
    />
  );
}
