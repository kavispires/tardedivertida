import { useMemo } from 'react';
// Icons
import { ClockIcon } from 'icons/ClockIcon';
import { PeopleAssessmentIcon } from 'icons/PeopleAssessmentIcon';
// Components
import { StatusBar } from 'components/general/StatusBar';
import { Translate } from 'components/language';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
// Internal
import type { Status } from '../utils/types';

type SummaryProps = {
  status: Status;
};

export function Summary({ status }: SummaryProps) {
  const entries = useMemo(
    () => [
      {
        key: 'time',
        title: <Translate pt="Tempo" en="Time" />,
        value: (
          <MetricHighlight icon={<ClockIcon />} iconPlacement="before">
            {status.questions}/{status.totalTime}
          </MetricHighlight>
        ),
      },
      {
        key: 'suspects',
        title: <Translate pt="Suspeitos Liberados" en="Released Suspects" />,
        value: (
          <MetricHighlight icon={<PeopleAssessmentIcon />} iconPlacement="before">
            {status.released}/{status.suspects}
          </MetricHighlight>
        ),
      },
      {
        key: 'score',
        title: <Translate pt="Pontuação" en="Score" />,
        value: <PointsHighlight iconPlacement="before">{status.score}</PointsHighlight>,
      },
    ],
    [status],
  );

  return <StatusBar entries={entries} title="Status" />;
}
