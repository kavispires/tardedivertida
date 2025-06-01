import { RulesWrapper } from 'pages/Daily/components/RulesWrapper';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';

type RulesProps = {
  date: string;
};

export function Rules({ date }: RulesProps) {
  return (
    <RulesWrapper
      demoVersion
      date={date}
      basicRules={
        <Translate
          pt={
            <>
              <li>Encontre os pares de coisas na grade.</li>
              <li>Você seleciona uma espaço e deve selecionar outro espaço que você acha que está o par.</li>
              <li>
                Um item <strong>NÃO</strong> pode aparecer mais de uma vez em uma mesma linha e coluna.
              </li>
              <li>
                Quando você não acerta o par você perde um <HeartFilled />
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled />. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Find the pairs of items on the grid.</li>
              <li>You select one space and must select another space that you think is the pair.</li>
              <li>
                An item <strong>cannot</strong> appear more than once in any row and any column.
              </li>
              <li>
                When you don't find the pair, you lose a <HeartFilled />
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
