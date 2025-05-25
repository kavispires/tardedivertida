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
        en={
          <>
            <li>You are a spy in a event and needs to find out who the culprit is.</li>
            <li>
              Your intel has statements to help identify the culprit, and you see a statement for the first 2
              people you release.
            </li>
            <li>
              You must release all innocent people so <strong>the culprit is the last person left</strong>.
            </li>
            <li>
              You can use a <HeartFilled /> to see another statement about the culprit.
            </li>
            <li>You lose immediately if you release the culprit.</li>
            <li>
              You have {SETTINGS.HEARTS} <HeartFilled /> but only two extra clues. Good luck!
            </li>
          </>
        }
        pt={
          <>
            <li>Você é um espião em um evento e precisa descobrir quem é o culpado.</li>
            <li>
              Você deve liberar todas as pessoas inocentes primeiro para que{' '}
              <strong>o culpado seja a última pessoa</strong>.
            </li>
            <li>
              Suas informações têm declarações para ajudar a identificar o culpado, e você três declarações
              grátis que você vê ao liberar suspeitos.
            </li>
            <li>
              Você pode usar <HeartFilled /> para ver declarações adicionais e você tem {SETTINGS.HEARTS}{' '}
              <HeartFilled /> para isso.
            </li>
            <li>
              <strong>ATENÇÃO: Você perde imediatamente se liberar o culpado. Boa sorte!</strong>
            </li>
          </>
        }
      />
    </Typography>
  );
}
