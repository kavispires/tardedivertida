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
      updatedRules
      basicRules={
        <Translate
          pt={
            <>
              <li>Descubra qual criança pegou o brinquedo.</li>
              <li>Crianças estão do lado uma da outra quando há uma seta entre elas.</li>
              <li>
                Podem haver mentirosas entre elas que podem ser igual ou um a menos que o número dado pelo
                jogo.
              </li>
              <li>Nem sempre a criança culpada mente, será que ela se arrependeu?</li>

              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Find out which kid took the toy.</li>
              <li>Kids are next to each other when there's an arrow between them.</li>
              <li>
                There may be liars among them, which can be equal to or one less than the number given by the
                game.
              </li>
              <li>The guilty kid doesn't always lie, did they regret it?</li>
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
