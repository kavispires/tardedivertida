// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
import { Typography } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';

export function Rules() {
  return (
    <Typography>
      <Translate
        pt={
          <>
            <li>Tente adivinhar a expressão secreta observando os desenhos.</li>
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
    </Typography>
  );
}
