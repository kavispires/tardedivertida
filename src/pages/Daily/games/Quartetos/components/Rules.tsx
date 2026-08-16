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
              en="The things on the grid have been secretly grouped into groups of four with common themes."
              pt="As coisas na grade foram secretamente agrupadas em grupos de quatro com temas em comum."
            />
          </li>
          <li>
            <Translate
              en="Form a group of four things that you think are related and click <strong>Submit</strong>."
              pt="Forme um grupo de quatro coisas que você acha que estão relacionadas e clique em <strong>Enviar</strong>."
            />
          </li>
          <li>
            <Translate
              en="Try to guess the four groups one by one."
              pt="Tente adivinhar os quatro grupos um a um."
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
              en="You have {hearts} {icon}. Good luck!"
              pt="Você tem {hearts} {icon}. Boa sorte!"
              values={{ hearts: SETTINGS.HEARTS, icon: <HeartFilled /> }}
            />
          </li>
        </>
      }
    />
  );
}
