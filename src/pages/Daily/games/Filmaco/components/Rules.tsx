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
              en="Try to guess the secret movie by looking at the icons and movie year."
              pt="Tente adivinhar o filme secreto observando os ícones e ano do filme."
            />
          </li>
          <li>
            <Translate
              en="The icons are not in order and may mean words in the movie title or about the plot."
              pt="Os ícones não estão em ordem e podem significar palavras no título ou sobre o enredo do filme."
            />
          </li>
          <li>
            <Translate
              en="You must press letter by letter (and numbers!) until the name is complete."
              pt="Você deve apertar letra por letra (e números!) até que o nome esteja completo."
            />
          </li>
          <li>
            <Translate
              en="Each letter you press that is not present in the answer removes a heart <heart/>."
              pt="Cada letra que você aperta que não está presente na resposta remove um coração <heart/>."
              values={{
                heart: <HeartFilled />,
              }}
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
