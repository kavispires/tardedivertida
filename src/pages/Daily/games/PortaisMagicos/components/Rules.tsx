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
              <li>Você está diante de 3 portais com imagens fantásticas.</li>
              <li>
                Organize as palavras de 3 letras até formar a palavra-chave que corresponde à similaridade
                entre os portais.
              </li>
              <li>Quando você acerta uma letra, ela se trava em verde até você acertar a palavra-chave.</li>
              <li>Você tem que passar por 3 corredores de portas.</li>
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
