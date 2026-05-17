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
              <li>Palavras-chaves como "Sempre" e "Nunca" se aplicam a todos os botões seguintes.</li>
              <li>
                Quando você faz algo errado, você perde um <HeartFilled />.
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
              <li>Keywords like "Always" and "Never" apply to all following buttons.</li>
              <li>
                When you do something wrong, you lose a <HeartFilled />.
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
