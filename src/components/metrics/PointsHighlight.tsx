// Icons
import { StarIcon } from '@icons/StarIcon';
// Components
import { Translate } from '@components/language/Translate';
import { type HighlightProps, MetricHighlight } from '@components/metrics/MetricHighlight';

/**
 * Metric highlight component displaying a star icon for points-related metrics
 * @deprecated Use PointsHighlightV2 instead, which automatically pluralizes the word "point" based on the value provided.
 */
export function PointsHighlight(props: HighlightProps) {
  return (
    <MetricHighlight
      icon={<StarIcon />}
      {...props}
    />
  );
}

/**
 * Metric highlight component displaying a star icon for points-related metrics
 * It automatically pluralizes the word "point" based on the value provided.
 * @param value - The number of points to display
 * @param omitText - Whether to omit the text "point(s)" after the value
 * @param iconPlacement - The placement of the icon (before or after the value)
 * @param props - Additional props to pass to the MetricHighlight component
 */
export function PointsHighlightV2({
  value,
  omitText = false,
  iconPlacement,
  ...props
}: Omit<HighlightProps, 'children'> & { value: number | string; omitText?: boolean }) {
  return (
    <MetricHighlight
      icon={<StarIcon />}
      iconPlacement={iconPlacement ?? 'before'}
      {...props}
    >
      {value}
      {!omitText && (
        <Translate
          pt={value === 1 ? ' ponto' : ' pontos'}
          en={value === 1 ? ' point' : ' points'}
        />
      )}
    </MetricHighlight>
  );
}
