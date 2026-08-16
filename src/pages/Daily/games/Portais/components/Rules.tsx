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
      basicRules={
        <>
          <li>
            <Translate
              en="You are facing portals with fantastic images."
              pt="Você está diante de portais com imagens fantásticas."
            />
          </li>
          <li>
            <Translate
              en="Organize the 3-letter words until you form the keyword that corresponds to the similarity between the portals."
              pt="Organize as palavras de 3 letras até formar a palavra-chave que corresponde à similaridade entre os portais."
            />
          </li>
          <li>
            <Translate
              en="When you hit a letter, it locks in yellow until you hit the keyword."
              pt="Quando você acerta uma letra, ela se trava em amarelo até você acertar a palavra-chave."
            />
          </li>
          <li>
            <Translate
              en="You have to go through 3 corridors of doors."
              pt="Você tem que passar por 3 corredores de portas."
            />
          </li>
          <li>
            <Translate
              en="Each wrong attempt removes a heart {icon}."
              pt="Cada tentativa errada remove um coração {icon}."
              values={{ icon: <HeartFilled /> }}
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} {icon} attempts to find the keyword."
              pt="Você tem {hearts} {icon} tentativas para encontrar a palavra-chave."
              values={{ hearts: SETTINGS.HEARTS, icon: <HeartFilled /> }}
            />
          </li>
        </>
      }
    />
  );
}
