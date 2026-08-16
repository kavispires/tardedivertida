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
              en="You are presented with two discs with 8 items each."
              pt="Você é apresentado com dois discos com 8 itens cada."
            />
          </li>
          <li>
            <Translate
              en="There is only one item that is common in both discs, click on it as quickly as possible."
              pt="Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível."
            />
          </li>
          <li>
            <Translate
              en="You have 60 seconds to hit the 15 pairs of discs."
              pt="Você tem 60 segundos para acertar os 15 pares de discos."
            />
          </li>
          <li>
            <Translate
              en="Each wrong item you click, a heart <heart/> is removed."
              pt="Cada item errado que você clica ou tentativa, remove-se um coração <heart/>."
              values={{
                heart: <HeartFilled />,
              }}
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} <heart/> chances. Good luck and watch out for fat fingers!"
              pt="Você tem {hearts} <heart/> chances. Boa sorte e cuidado com dedos gordos!"
              values={{
                hearts: SETTINGS.HEARTS,
                heart: <HeartFilled />,
              }}
            />
          </li>
        </>
      }
      weekendRules={
        <>
          <li>
            <Translate
              en="You are presented with two discs with 9 items each."
              pt="Você é apresentado com dois discos com 9 itens cada."
            />
          </li>
          <li>
            <Translate
              en="There is only one item that is common in both discs, click on it as quickly as possible."
              pt="Existe apenas um item que é comum nos dois discos, clique nele o mais rápido possível."
            />
          </li>
          <li>
            <Translate
              en="You have 60 seconds to hit the 15 pairs of discs."
              pt="Você tem 60 segundos para acertar os 15 pares de discos."
            />
          </li>
          <li>
            <Translate
              en="Each wrong item you click or attempt, a heart <heart/> is removed."
              pt="Cada item errado que você clica ou tentativa, remove-se um coração <heart/>."
              values={{
                heart: <HeartFilled />,
              }}
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} <heart/> chances. Good luck and watch out for fat fingers!"
              pt="Você tem {hearts} <heart/> chances. Boa sorte e cuidado com dedos gordos!"
              values={{
                hearts: SETTINGS.HEARTS,
                heart: <HeartFilled />,
              }}
            />
          </li>
        </>
      }
      additionalRules={
        <>
          <Translate
            en="<strong>Challenge Mode:</strong>"
            pt="<strong>Modo difícil:</strong>"
          />
          <li>
            <Translate
              en="Items never repeat in sequence."
              pt="Itens nunca repetem em sequência."
            />
          </li>
        </>
      }
    />
  );
}
