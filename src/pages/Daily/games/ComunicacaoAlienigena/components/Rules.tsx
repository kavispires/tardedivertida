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
            <li>
              O alienígena precisa de sua ajuda para abduzir 4 coisas, porém ele não fala a língua dos
              terráqueos.
            </li>
            <li>
              O alienígena se comunica através de símbolos que representam um atributo em comum entre os
              exemplos dados.
            </li>
            <li>
              Por exemplo, o que uma bola, uma melancia e uma pizza tem em comum? Todos são redondos! Será que
              o alienígena quer dizer que aquele símbolo significa redondo?
            </li>
            <li>
              Você deve entregar as 4 coisas na ordem correta de uma vez. O alienígena apenas te diz se todas
              estão corretas ou não.
            </li>
            <li>
              Cada tentativa errada remove um coração e você tem apenas {SETTINGS.HEARTS} <HeartFilled />.
            </li>
            <li>Boa sorte!</li>
          </>
        }
        en={
          <>
            <li>The alien needs to abduct some things, but it can't speak our language.</li>
            <li>
              The alien communicates through symbols that represent a common attribute between the given
              examples.
            </li>
            <li>
              For example, what does a ball, a watermelon, and a pizza have in common? They're all round! Does
              the alien mean that symbol represents round?
            </li>
            <li>
              You must deliver 4 things in the correct order and press send. The alien only tells you if all
              are correct or not.
            </li>
            <li>
              Each wrong attempt removes a heart and you only have 3 <HeartFilled />.
            </li>
            <li>Good luck!</li>
          </>
        }
      />
    </Typography>
  );
}
