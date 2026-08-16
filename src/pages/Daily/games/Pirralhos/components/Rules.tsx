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
              en="Find out which kid took the toy."
              pt="Descubra qual criança pegou o brinquedo."
            />
          </li>
          <li>
            <Translate
              en="Kids are next to each other when there's an arrow between them."
              pt="Crianças estão do lado uma da outra quando há uma seta entre elas."
            />
          </li>
          <li>
            <Translate
              en="There may be liars among them, which can be equal to or one less than the number given by the game."
              pt="Podem haver mentirosas entre elas que podem ser igual ou um a menos que o número dado pelo jogo."
            />
          </li>
          <li>
            <Translate
              en="The guilty kid doesn't always lie, did they regret it?"
              pt="Nem sempre a criança culpada mente, será que ela se arrependeu?"
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} {icon} chances. Good luck!"
              pt="Você tem {hearts} {icon} chances. Boa sorte!"
              values={{
                hearts: SETTINGS.HEARTS,
                icon: <HeartFilled />,
              }}
            />
          </li>
        </>
      }
    />
  );
}
