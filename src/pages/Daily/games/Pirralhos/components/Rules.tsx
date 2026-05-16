// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language/Translate';
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
      betaVersion
      basicRules={
        <Translate
          pt={
            <>
              <li>Descubra qual criança pegou o brinquedo.</li>
              <li>Crianças estão do lado uma da outra quando há uma seta entre elas.</li>
              <li>Existe um ou mais mentirosos entre elas, e pode ser o culpado.</li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> chances. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Find out which kid took the toy.</li>
              <li>Kids are next to each other when there's an arrow between them.</li>
              <li>There is one or more liars among them, and it could be the culprit.</li>
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
