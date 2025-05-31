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
              <li>Tente adivinhar o filme secreto observando os ícones e ano do filme.</li>
              <li>
                Os ícones não estão em ordem e podem significar palavras no título ou sobre o enredo do filme.
              </li>
              <li>Você deve apertar letra por letra (e números!) até que o nome esteja completo.</li>
              <li>
                Cada letra que você aperta que não está presente na resposta remove um coração <HeartFilled />
                .
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Try to guess the secret movie by looking at the icons and movie year.</li>
              <li>The icons are not in order and may mean words in the movie title or about the plot.</li>
              <li>You must press letter by letter (and numbers!) until the name is complete.</li>
              <li>
                Each letter you press that is not present in the answer removes a heart <HeartFilled />.
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
