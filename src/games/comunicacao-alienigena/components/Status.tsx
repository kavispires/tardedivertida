// Ant Design Resources
import { Badge } from 'antd';
// Types
import type { OfferingsStatus } from '../utils/types';
// Icons
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
// Components
import { Translate } from 'components/language';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction } from 'components/text';
import { CurseItemHighlight, ItemsHighlight } from './Highlights';

type StatusProps = {
  status: OfferingsStatus;
};
export function Status({ status }: StatusProps) {
  return (
    <Instruction>
      <ul>
        <li>
          <Translate pt="Objetos entregues/queridos" en="Delivered/Needed objects" />:{' '}
          <ItemsHighlight>
            {status.found}/{status.needed}
          </ItemsHighlight>
        </li>
        <li>
          <Translate pt="Tempo Sobrando" en="Remaining Time" />:{' '}
          <TimeHighlight>{status.timeLeft}</TimeHighlight>
        </li>
        <li>
          <Translate pt="Objetos disponíveis" en="Remaining Objects" />:{' '}
          <MetricHighlight icon={<BoxQuestionMarkIcon />}>{status.total}</MetricHighlight>
        </li>
        <li>
          <Translate pt="Objetos amaldiçoados" en="Cursed Objects" />:{' '}
          <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight>
        </li>
      </ul>
      <p>
        <Badge size="small" count={2} color="orange"></Badge> -{' '}
        <Translate
          en="The little orange numbers on the items board indicate the number of times the object was asked about."
          pt="Os números nos círculos laranjas na grade de itens indicam quantas vezes o objeto foi usado em uma pergunta."
        />
      </p>
    </Instruction>
  );
}
