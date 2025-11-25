import { useMemo } from 'react';
// Ant Design Resources
import { Divider, Tooltip } from 'antd';
// Icons
import { AgeIcon } from 'icons/AgeIcon';
import { CulturesIcon } from 'icons/CulturesIcon';
import { GenderIcon } from 'icons/GenderIcon';
import { RainbowIcon } from 'icons/RainbowIcon';
// Components
import { Translate } from 'components/language';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
// Internal
import type { FeatureFilm } from '../utils/types';
import { getMovieSummary } from '../utils/helpers';

type MovieStatsProps = {
  movie: FeatureFilm;
};

export function MovieStats({ movie }: MovieStatsProps) {
  const summary = useMemo(() => getMovieSummary(movie), [movie]);
  return (
    <div className="summary">
      <Tooltip title={<Translate pt="Diversidade de gênero" en="Gender Diversity" />}>
        <div>
          <MetricHighlight icon={<GenderIcon />}>{summary.genderDiversity}%</MetricHighlight>
        </div>
      </Tooltip>
      <Divider orientation="vertical" />
      <Tooltip title={<Translate pt="Diversidade de idade" en="Age Diversity" />}>
        <div>
          <MetricHighlight icon={<AgeIcon />}>{summary.ageDiversity}%</MetricHighlight>
        </div>
      </Tooltip>
      <Divider orientation="vertical" />
      <Tooltip title={<Translate pt="Diversidade cultural" en="Cultural Diversity" />}>
        <div>
          <MetricHighlight icon={<CulturesIcon />}>{summary.ethnicityDiversity}%</MetricHighlight>
        </div>
      </Tooltip>
      {summary.isLGBTQA && (
        <Tooltip title={<Translate pt="LGBTQIA+" en="LGBTQIA+" />}>
          <div>
            <MetricHighlight icon={<RainbowIcon />}>100%</MetricHighlight>
          </div>
        </Tooltip>
      )}
    </div>
  );
}
