import { RulesWrapper } from 'pages/Daily/components/RulesWrapper';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';

type RulesProps = {
  date: string;
};

export function Rules({ date }: RulesProps) {
  return (
    <RulesWrapper
      demoVersion
      date={date}
      basicRules={
        <Translate
          en={
            <>
              <li>You are a spy in a event and needs to find out who the culprit is.</li>
              <li>
                Your intel has statements to help identify the culprit, and you see a statement for the first
                2 people you release.
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
                <strong>o culpado seja a última pessoa restante</strong>.
              </li>
              <li>
                Seus informantes têm declarações para ajudar a identificar o culpado, você começa com uma e
                terá duas declarações adicionais grátis ao liberar suspeitos.
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
      }
    />
  );
}
