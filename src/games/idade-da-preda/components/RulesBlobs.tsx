// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function ScoringRules() {
  return (
    <Translate
      en="You gain {points2} for every name you paired correctly, and the creator gains {points1}."
      pt="Você ganha {points2} por cada nome que você acertou, e o criador ganha {points1}."
      values={{
        points2: (
          <PointsHighlight
            type="positive"
            value={2}
          />
        ),
        points1: (
          <PointsHighlight
            type="positive"
            value={1}
          />
        ),
      }}
    />
  );
}
