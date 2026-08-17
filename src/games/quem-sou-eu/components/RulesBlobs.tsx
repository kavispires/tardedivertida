// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function ScoringRules({ currentRound }: { currentRound: number }) {
  return (
    <Translate
      pt="Você ganha {points} para cada par que acertar e também {points} para cada jogador que acertar o seu."
      en="You get {points} for each pair you get correctly and also {points} for each player who gets your character correctly"
      values={{
        points: <PointsHighlight value={currentRound} />,
      }}
    />
  );
}
