// Icons
import { StarIcon } from '@icons/StarIcon';
// Components
import { Translate } from '@components/language/Translate';
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a star icon for points-related metrics
 * It automatically pluralizes the word "point" based on the value provided.
 * @param value - The number of points to display
 * @param omitText - Whether to omit the text "point(s)" after the value
 * @param iconPlacement - The placement of the icon (before or after the value)
 * @param bonus - Whether the points are a bonus
 * @param props - Additional props to pass to the MetricHighlight component
 */
export function PointsHighlight({
  value,
  omitText = false,
  iconPlacement,
  bonus = false,
  ...props
}: Omit<HighlightProps, 'children'> & { value: number | string; omitText?: boolean; bonus?: boolean }) {
  return (
    <MetricHighlight
      icon={<StarIcon />}
      {...props}
    >
      {value}
      {!omitText &&
        (bonus ? (
          <Translate
            pt={value === 1 ? ' ponto bônus' : ' pontos bônus'}
            en={value === 1 ? ' bonus point' : ' bonus points'}
          />
        ) : (
          <Translate
            pt={value === 1 ? ' ponto' : ' pontos'}
            en={value === 1 ? ' point' : ' points'}
          />
        ))}
    </MetricHighlight>
  );
}
