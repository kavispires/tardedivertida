import { Typography } from 'antd';
import { Translate } from 'components/language';
import { BetaBanner } from 'pages/Daily/components/BetaBanner';

import { HeartFilled } from '@ant-design/icons';

import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <Typography>
      <BetaBanner />
      <Translate
        pt={
          <>
            <li>Você é o funcionário uma empresa de compras online e está encarregado do estoque.</li>
            <li>
              Coloque os 16 produtos na prateleira do jeito que você preferir. O ideal é que você siga uma
              lógica que você saiba onde eles vão.
            </li>
            <li>A pegadinha é que você não vê mais o produto após posicioná-lo.</li>
            <li>
              Após todos os produtos estarem organizados, você receberá 5 pedidos. Desses 5, apenas 4 estão em
              estoque.
            </li>
            <li>Selecione os produtos em estoque um a um, e rejeite o produto fora de estoque.</li>
            <li>
              A cada vez que você completa todos os pedidos, se tudo não estiver correto, você perde um{' '}
              <HeartFilled />.
            </li>
            <li>
              Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
            </li>
          </>
        }
        en={
          <>
            <li>You are the employee of an online shopping company and are in charge of stock.</li>
            <li>
              Place the 16 products on the shelf the way you prefer. It is ideal that you follow a logic of
              where they will go.
            </li>
            <li>
              The catch is that you no longer see the product after placing it, you have to remember where it
              is.
            </li>
            <li>
              After all products are organized, you will receive 6 requests. Of these 6, only 4 are in stock.
            </li>
            <li>Select the products in stock one by one, and reject the out-of-stock products.</li>
            <li>
              Every time you complete all orders, if everything is not correct, you lose a <HeartFilled />.
            </li>
          </>
        }
      />
    </Typography>
  );
}
