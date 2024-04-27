import { Typography } from 'antd';
import { Translate } from 'components/language';

import { HeartFilled } from '@ant-design/icons';

import { BetaBanner } from '../../../components/BetaBanner';

export function Rules() {
  return (
    <Typography>
      <BetaBanner />
      <Translate
        pt={
          <>
            <li>Você é apresentado com dois discos com 8 itens cada.</li>
            <li>Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível.</li>
            <li>Você tem 60 segundos para acertar o maior número de discos.</li>
            <li>
              Cada item errado que você clica, remove-se um coração e você tem apenas 3 <HeartFilled />.
            </li>
            <li>
              <strong>Modo difícil:</strong> Itens nunca repetem em sequência.
            </li>
            <li>Boa sorte e cuidado com dedos gordos!</li>
          </>
        }
        en={
          <>
            <li>You are presented with two discs with 8 items each.</li>
            <li>There is only one item that is common in both discs, click on it as quickly as possible.</li>
            <li>You have 60 seconds to hit the most discs.</li>
            <li>
              Each wrong item you click, a heart is removed and you only have 3 <HeartFilled />.
            </li>
            <li>
              <strong>Hard mode:</strong> Items never repeat in sequence.
            </li>
            <li>Good luck and watch out for fat fingers!</li>
          </>
        }
      />
    </Typography>
  );
}
