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
              en="Try to guess the secret expression by looking at the drawings."
              pt="Você deve adivinhar a expressão secreta observando os desenhos."
            />
          </li>
          <li>
            <Translate
              en="You must press letter by letter until the name is complete."
              pt="Você deve apertar letra por letra até que o nome esteja completo."
            />
          </li>
          <li>
            <Translate
              en="Each letter you press that is not present in the answer removes a heart."
              pt="Cada letra que você aperta que não está presente na resposta remove um coração."
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} <heart/> chances. Good luck!"
              pt="Você tem {hearts} <heart/> chances. Boa sorte!"
              values={{
                hearts: SETTINGS.HEARTS,
                heart: <HeartFilled />,
              }}
            />
          </li>
        </>
      }
    />
  );
}
