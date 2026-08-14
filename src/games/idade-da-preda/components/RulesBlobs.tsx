// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function ScoringRules() {
  return (
    <Translate
      en={
        <>
          You gain{' '}
          <PointsHighlight
            type="positive"
            value={2}
          />{' '}
          for every name you paired correctly, and the creator gains{' '}
          <PointsHighlight
            type="positive"
            value={1}
          />
          .
        </>
      }
      pt={
        <>
          Você ganha{' '}
          <PointsHighlight
            type="positive"
            value={2}
          />{' '}
          por cada nome que você acertou, e o criador ganha{' '}
          <PointsHighlight
            type="positive"
            value={1}
          />
          .
        </>
      }
    />
  );
}
