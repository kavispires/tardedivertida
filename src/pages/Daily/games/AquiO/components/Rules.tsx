// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
import { Typography } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <Typography>
      <Translate
        pt={
          <>
            <li>Você é apresentado com dois discos com 8 itens cada.</li>
            <li>Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível.</li>
            <li>Você tem 60 segundos para acertar o maior número de discos.</li>
            <li>
              Cada item errado que você clica, remove-se um coração <HeartFilled />.
            </li>
            <li>
              <strong>Modo difícil:</strong> Itens nunca repetem em sequência.
            </li>
            <li>
              Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte e cuidado com dedos gordos!
            </li>
          </>
        }
        en={
          <>
            <li>You are presented with two discs with 8 items each.</li>
            <li>There is only one item that is common in both discs, click on it as quickly as possible.</li>
            <li>You have 60 seconds to hit the most discs.</li>
            <li>
              Each wrong item you click, a heart <HeartFilled /> is removed.
            </li>
            <li>
              <strong>Hard mode:</strong> Items never repeat in sequence.
            </li>
            <li>
              You have {SETTINGS.HEARTS} <HeartFilled /> chances. Good luck and watch out for fat fingers!
            </li>
          </>
        }
      />
    </Typography>
  );
}
