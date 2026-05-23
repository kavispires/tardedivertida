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
      basicRules={
        <Translate
          pt={
            <>
              <li>Complete a sequência de botões.</li>
              <li>Siga as instruções do botão, lembre-se de instruções anteriores.</li>
              <li>Aperte a quantidade de vezes exata que está indicada.</li>
              <li>
                Palavras-chaves como "Sempre" e "Nunca" se aplicam a todos os botões seguintes, sendo "Sempre"
                mais importante que "Nunca".
              </li>
              <li>
                Quando você faz algo errado, você perde um <HeartFilled /> e tem que começar do início, mas os
                botões serão os mesmos, na mesma ordem.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled />. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Complete the button sequence.</li>
              <li>Follow the button instructions, remember previous instructions.</li>
              <li>Press the exact amount of times that is indicated.</li>
              <li>
                Keywords like "Always" and "Never" apply to all following buttons, with "Always" being more
                important than "Never".
              </li>
              <li>
                When you do something wrong, you lose a <HeartFilled /> and have to start over, but the
                buttons will be the same, in the same order.
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
