import { DemoBanner } from 'pages/Daily/components/BetaBanner';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
import { Typography } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <>
      <DemoBanner />

      <Typography>
        <Translate
          pt={
            <>
              <li>
                Os objetos na grade foram secretamente agrupados em grupos de quatro com um tema em comum.
              </li>
              <li>
                Forme um grupo de quatro coisas que você acha que estão relacionadas e clique em{' '}
                <strong>Enviar</strong>.
              </li>
              <li>Tente adivinhar os quatro grupos um a um.</li>
              <li>
                Cada tentativa errada remove um coração e você tem apenas {SETTINGS.HEARTS} <HeartFilled />.
              </li>
              <li>Boa sorte!</li>
            </>
          }
          en={
            <>
              <li>?</li>
              <li>?</li>
            </>
          }
        />
      </Typography>
    </>
  );
}
