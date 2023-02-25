// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
import { QuestionIcon } from 'icons/QuestionIcon';
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
          <Translate pt="Objetos disponíveis" en="Available Objects" />:{' '}
          <ItemsHighlight>{status.total}</ItemsHighlight>
        </li>
        <li>
          <Translate pt="Objetos amaldiçoados" en="Cursed Objects" />:{' '}
          <CurseItemHighlight>{status.totalCurses} </CurseItemHighlight>
        </li>
        <li>
          <Translate pt="Objetos necessários" en="Desired Objects" />:{' '}
          <MetricHighlight icon={<QuestionIcon />}>{status.needed}</MetricHighlight>
        </li>
        <li>
          <Translate pt="Objetos entregues" en="Delivered Objects" />:{' '}
          <MetricHighlight icon={<BoxCheckMarkIcon />}>{status.found}</MetricHighlight>
        </li>
        <li>
          <Translate pt="Objetos que faltam" en="Remaining Objects" />:{' '}
          <MetricHighlight icon={<BoxQuestionMarkIcon />}>
            {Math.abs(status.needed - status.found)}
          </MetricHighlight>
        </li>
        <li>
          <Translate pt="Tempo Sobrando" en="Remaining Time" />:{' '}
          <TimeHighlight>{status.timeLeft} </TimeHighlight>
        </li>
      </ul>
    </Instruction>
  );
}
