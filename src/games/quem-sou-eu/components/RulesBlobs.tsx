// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function ScoringRules({ currentRound }: { currentRound: number }) {
  return (
    <Translate
      pt={
        <>
          Você ganha <PointsHighlight value={currentRound} /> para cada par que acertar e também{' '}
          <PointsHighlight value={currentRound} /> para cada jogador que acertar o seu.
        </>
      }
      en={
        <>
          You get <PointsHighlight value={currentRound} /> for each pair you get correctly and also{' '}
          <PointsHighlight value={currentRound} /> for each player who gets your character correctly
        </>
      }
    />
  );
}
