// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';
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
      basicRules={
        <>
          <li>
            <Translate
              en="Assemble the stained glass puzzle as fast as you can!"
              pt="Monte o vitral quebra-cabeça o mais rápido possível!"
            />
          </li>
          <li>
            <Translate
              en="When you drag a piece next to another one that would match, they will attach."
              pt="Ao arrastar uma peça para perto de outra que combine, elas se grudam."
            />
          </li>
          <li>
            <Translate
              en="Every time you attach a piece, you earn 1 point + the amount of hearts you have left for each piece that is in the correct position."
              pt="Cada vez que você grudar uma peça, você ganha 1 ponto + a quantidade de corações que você tem restante, para cada peça que está na posição correta na grade."
            />
          </li>
          <li>
            <Translate
              en="You have {hearts} and lose one heart every {seconds} seconds."
              pt="Você tem {hearts} e perde um coração a cada {seconds} segundos."
              values={{
                hearts: <HeartFilled />,
                seconds: <strong>{SETTINGS.HEART_LOSS_INTERVAL_SECONDS + numberOfPieces}</strong>,
              }}
            />
          </li>
          <div style={{ listStyle: 'none' }}>
            <small>
              <Translate
                en="* The time to lose a heart depends on the number of pieces in the puzzle."
                pt="* O tempo para perder um coração depende do número de peças no quebra-cabeça."
              />
            </small>
          </div>
        </>
      }
    />
  );
}
