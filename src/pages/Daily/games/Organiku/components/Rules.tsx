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
              pt="Encontre os pares de coisas na grade."
              en="Find the pairs of items on the grid."
            />
          </li>
          <li>
            <Translate
              pt="Você seleciona uma espaço e deve selecionar outro espaço que você acha que está o par."
              en="You select one space and must select another space that you think is the pair."
            />
          </li>
          <li>
            <Translate
              pt="Um item <strong>NÃO</strong> pode aparecer mais de uma vez em uma mesma linha e coluna."
              en="An item <strong>cannot</strong> appear more than once in any row and any column."
            />
          </li>
          <li>
            <Translate
              pt="Quando você não acerta o par você perde um {hearts}"
              en="When you don't find the pair, you lose a {hearts}"
              values={{
                hearts: (
                  <>
                    {SETTINGS.HEARTS} <HeartFilled />
                  </>
                ),
              }}
            />
          </li>
          <li>
            <Translate
              pt="Você tem {hearts}. Boa sorte!"
              en="You have {hearts}. Good luck!"
              values={{
                hearts: (
                  <>
                    {SETTINGS.HEARTS} <HeartFilled />
                  </>
                ),
              }}
            />
          </li>
        </>
      }
    />
  );
}
