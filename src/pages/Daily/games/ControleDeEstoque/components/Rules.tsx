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
      date={date}
      basicRules={
        <Translate
          pt={
            <>
              <li>Você é o funcionário uma empresa de compras online e está encarregado do estoque.</li>
              <li>
                Coloque os 16 produtos na prateleira do jeito que você preferir. O ideal é que você siga uma
                lógica que depois você saiba onde eles estão.
              </li>
              <li>A pegadinha é que você não vê mais o produto depois de posicioná-lo.</li>
              <li>
                Após todos os produtos estarem organizados, você receberá 5 pedidos. Desses 5, apenas 4 estão
                em estoque (na prateleira).
              </li>
              <li>Selecione os produtos em estoque deixando de fora o produto fora de estoque.</li>
              <li>
                Tente completar todos os pedidos sem errar. A cada erro, você perde um <HeartFilled />.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>You are an employee at an online shopping company and are in charge of the stock.</li>
              <li>
                Place the 16 products on the shelf as you prefer. It is ideal that you follow a logic that you
                can remember where they are later.
              </li>
              <li>The catch is that you won't see the product anymore after you position it.</li>
              <li>
                After all products are organized, you will receive 5 orders. Of these 5, only 4 are in stock
                (on the shelf).
              </li>
              <li>Select the products in stock, leaving out the out-of-stock product.</li>
              <li>
                Try to complete all orders without making mistakes. For each mistake, you lose a{' '}
                <HeartFilled />.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled /> chances. Good luck!
              </li>
            </>
          }
        />
      }
    />
  );
}
