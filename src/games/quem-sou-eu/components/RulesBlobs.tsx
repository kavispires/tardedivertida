// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

export function ScoringRules({ currentRound }: { currentRound: number }) {
  return (
    <Translate
      pt={
        <>
          Você ganha <PointsHighlight>{currentRound}</PointsHighlight>ponto para cada par que acertar e também{' '}
          <PointsHighlight>{currentRound}</PointsHighlight>ponto para cada jogador que acertar o seu.
        </>
      }
      en={
        <>
          You get <PointsHighlight>{currentRound}</PointsHighlight>point for each pair you get correctly and
          also <PointsHighlight>{currentRound}</PointsHighlight>point for each player who gets your character
          correctly
        </>
      }
    />
  );
}
