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
              <li>Você é apresentado com dois discos com 8 itens cada.</li>
              <li>Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível.</li>
              <li>Você tem 60 segundos para acertar os 15 pares de discos.</li>
              <li>
                Cada item errado que você clica ou tentativa, remove-se um coração <HeartFilled />.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte e cuidado com dedos gordos!
              </li>
            </>
          }
          en={
            <>
              <li>You are presented with two discs with 8 items each.</li>
              <li>
                There is only one item that is common in both discs, click on it as quickly as possible.
              </li>
              <li>You have 60 seconds to hit the 15 pairs of discs.</li>
              <li>
                Each wrong item you click, a heart <HeartFilled /> is removed.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled /> chances. Good luck and watch out for fat fingers!
              </li>
            </>
          }
        />
      }
      weekendRules={
        <Translate
          pt={
            <>
              <li>Você é apresentado com dois discos com 9 itens cada.</li>
              <li>Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível.</li>
              <li>Você tem 60 segundos para acertar os 15 pares de discos.</li>
              <li>
                Cada item errado que você clica ou tentativa, remove-se um coração <HeartFilled />.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte e cuidado com dedos gordos!
              </li>
            </>
          }
          en={
            <>
              <li>You are presented with two discs with 9 items each.</li>
              <li>
                There is only one item that is common in both discs, click on it as quickly as possible.
              </li>
              <li>You have 60 seconds to hit the 15 pairs of discs.</li>
              <li>
                Each wrong item you click or attempt, a heart <HeartFilled /> is removed.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled /> chances. Good luck and watch out for fat fingers!
              </li>
            </>
          }
        />
      }
      additionalRules={
        <Translate
          pt={
            <>
              <strong>Modo difícil:</strong>
              <li>Itens nunca repetem em sequência.</li>
            </>
          }
          en={
            <>
              <strong>Challenge Mode:</strong>
              <li>Items never repeat in sequence.</li>
            </>
          }
        />
      }
    />
  );
}
