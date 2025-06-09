// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

export function ScoringRules() {
  return (
    <Translate
      en={
        <>
          You gain <PointsHighlight type="positive">2</PointsHighlight> points for every name you paired
          correctly, and the creator gains <PointsHighlight type="positive">1</PointsHighlight> point.
        </>
      }
      pt={
        <>
          Você ganha <PointsHighlight type="positive">2</PointsHighlight> pontos por cada nome que você
          acertou, e o criador ganha <PointsHighlight type="positive">1</PointsHighlight> ponto.
        </>
      }
    />
  );
}
