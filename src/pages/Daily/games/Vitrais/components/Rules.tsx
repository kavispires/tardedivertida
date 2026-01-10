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
  numberOfPieces: number;
};

export function Rules({ date, numberOfPieces }: RulesProps) {
  return (
    <RulesWrapper
      date={date}
      betaVersion
      basicRules={
        <Translate
          pt={
            <>
              <li>Monte o vitral quebra-cabeça o mais rápido possível.</li>
              <li>Ao arrastar uma peça para perto de outra que combine, elas se grudam.</li>
              <li>
                Cada vez que você grudar uma peça, você ganha 1 ponto + a quantidade de corações que você tem
                restante, para cada peça que está na posição correta na grade.
              </li>
              <li>
                Você tem {SETTINGS.HEARTS} <HeartFilled /> e perde um coração a cada{' '}
                <strong>{SETTINGS.HEART_LOSS_INTERVAL_SECONDS + numberOfPieces} segundos*</strong>. Boa sorte!
              </li>
              <li style={{ listStyle: 'none' }}>
                <small>* O tempo para perder um coração depende do número de peças no quebra-cabeça.</small>
              </li>
            </>
          }
          en={
            <>
              <li>Assemble the stained glass puzzle as fast as you can.</li>
              <li>When you drag a piece next to another one that would match, they will attach.</li>
              <li>
                Every time you attach a piece, you earn 1 point + the amount of hearts you have left for each
                piece that is in the correct position.
              </li>
              <li>
                You have {SETTINGS.HEARTS} <HeartFilled /> and lose one heart every{' '}
                <strong>{SETTINGS.HEART_LOSS_INTERVAL_SECONDS + numberOfPieces} seconds*</strong>. Good luck!
              </li>
              <li style={{ listStyle: 'none' }}>
                <small>* The time to lose a heart depends on the number of pieces in the puzzle.</small>
              </li>
            </>
          }
        />
      }
    />
  );
}
