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
              <li>As coisas na grade foram secretamente agrupadas em grupos de quatro com temas em comum.</li>
              <li>
                Forme um grupo de quatro coisas que você acha que estão relacionadas e clique em{' '}
                <strong>Enviar</strong>.
              </li>
              <li>Tente adivinhar os quatro grupos um a um.</li>
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
              <li>
                The things on the grid have been secretly grouped into groups of four with common themes.
              </li>
              <li>
                Form a group of four things that you think are related and click <strong>Submit</strong>.
              </li>
              <li>Try to guess the four groups one by one.</li>
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
