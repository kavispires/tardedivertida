// Ant Design Resources
import { Badge } from 'antd';
// Icons
import { BoxQuestionMarkIcon } from '@icons/BoxQuestionMarkIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { MetricHighlight } from '@components/metrics/MetricHighlight';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
// Internal
import type { OfferingsStatus } from '../utils/types';
import { CurseItemHighlight, ItemsHighlight } from './Highlights';

type StatusProps = {
  status: OfferingsStatus;
};

export function Status({ status }: StatusProps) {
  return (
    <Surface>
      <ul>
        <li>
          <Translate
            en="Delivered/Needed objects"
            pt="Objetos entregues/queridos"
          />
          :{' '}
          <ItemsHighlight>
            {status.found}/{status.needed}
          </ItemsHighlight>
        </li>
        <li>
          <Translate
            en="Remaining Time"
            pt="Tempo Sobrando"
          />
          : <TimeHighlight>{status.timeLeft}</TimeHighlight>
        </li>
        <li>
          <Translate
            en="Remaining Objects"
            pt="Objetos disponíveis"
          />
          : <MetricHighlight icon={<BoxQuestionMarkIcon />}>{status.total}</MetricHighlight>
        </li>
        <li>
          <Translate
            en="Cursed Objects"
            pt="Objetos amaldiçoados"
          />
          : <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight>
        </li>
      </ul>
      <p>
        <Badge
          size="small"
          count={2}
          color="orange"
        ></Badge>{' '}
        -{' '}
        <Translate
          en="The little orange numbers on the items board indicate the number of times the object was asked about."
          pt="Os números nos círculos laranjas na grade de itens indicam quantas vezes o objeto foi usado em uma pergunta."
        />
      </p>
    </Surface>
  );
}
