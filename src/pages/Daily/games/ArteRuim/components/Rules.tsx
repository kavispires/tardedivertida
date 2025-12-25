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
              <li>Você deve adivinhar a expressão secreta observando os desenhos.</li>
              <li>Você deve apertar letra por letra até que o nome esteja completo.</li>
              <li>Cada letra que você aperta que não está presente na resposta remove um coração.</li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Try to guess the secret expression by looking at the drawings.</li>
              <li>You must press letter by letter until the name is complete.</li>
              <li>Each letter you press that is not present in the answer removes a heart.</li>
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
