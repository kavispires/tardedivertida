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
              en="Complete the sequence of buttons."
              pt="Complete a sequência de botões."
            />
          </li>
          <li>
            <Translate
              en="Follow the button instructions, remember previous instructions."
              pt="Siga as instruções do botão, lembre-se de instruções anteriores."
            />
          </li>
          <li>
            <Translate
              en="Press the exact amount of times that is indicated."
              pt="Aperte a quantidade de vezes exata que está indicada."
            />
          </li>
          <li>
            <Translate
              en='Keywords like "Always" and "Never" apply to all following buttons, with "Always" being more important than "Never".'
              pt='Palavras-chaves como "Sempre" e "Nunca" se aplicam a todos os botões seguintes, sendo "Sempre" mais importante que "Nunca".'
            />
          </li>
          <li>
            <Translate
              en="When you do something wrong, you lose a {icon} and have to start over, but the buttons will be the same, in the same order."
              pt="Quando você faz algo errado, você perde um {icon} e tem que começar do início, mas os botões serão os mesmos, na mesma ordem."
              values={{
                icon: <HeartFilled />,
              }}
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} {icon}. Good luck!"
              pt="Você tem {hearts} {icon}. Boa sorte!"
              values={{
                hearts: SETTINGS.HEARTS,
                icon: <HeartFilled />,
              }}
            />
          </li>
        </>
      }
    />
  );
}
