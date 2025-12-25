// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
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
              <li>Monte o vitral quebra-cabeça o mais rápido possível.</li>
              <li>Você seleciona e arrasta cada peça para a posição que você acha correta.</li>
              <li>
                A cada peça que você coloca corretamente, você ganha 1 ponto + a quantidade de corações que
                você tem sobrando.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> e perde um coração a cada{' '}
                {SETTINGS.HEART_LOSS_INTERVAL_SECONDS} segundos. Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>Assemble the stained glass puzzle as fast as you can.</li>
              <li>You select and drag each piece to the position you think is correct.</li>
              <li>
                For each piece you place correctly, you earn 1 point + the amount of hearts you have left.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled /> and lose one heart every{' '}
                {SETTINGS.HEART_LOSS_INTERVAL_SECONDS} seconds. Good luck!
              </li>
            </>
          }
        />
      }
    />
  );
}
