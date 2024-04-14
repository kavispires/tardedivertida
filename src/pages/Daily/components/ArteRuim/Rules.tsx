import { HeartFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import { Translate } from 'components/language';

export function Rules() {
  return (
    <Typography>
      <Translate
        pt={
          <>
            <li>Tente adivinhar a expressão secreta observando os desenhos e apertando letra por letra.</li>
            <li>
              Cada letra que você aperta que não está presente na resposta remove um coração e você tem apenas
              3 <HeartFilled />.
            </li>
            <li>Boa sorte!</li>
          </>
        }
        en={
          <>
            <li>
              Try to guess the secret expression by observing the drawings and then pressing letter by letter.
            </li>
            <li>
              Each letter you press that is not present in the answer removes a heart and you only have 3{' '}
              <HeartFilled />.
            </li>
            <li>Good luck!</li>
          </>
        }
      />
    </Typography>
  );
}
