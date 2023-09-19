// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

export function ScoringRule() {
  return (
    <Translate
      pt={
        <>
          Cada resposta válida ganha <PointsHighlight>pontos</PointsHighlight> de acordo com as estrelas sua
          letra (row).
          <br />O primeiro jogador a responder em cada célula, também ganha{' '}
          <PointsHighlight type="positive">pontos bônus</PointsHighlight> igual as estrelas da categoria
          (coluna).
        </>
      }
      en={
        <>
          Each valid answer earns <PointsHighlight>points</PointsHighlight> according to the stars of its
          letter (row).
          <br />
          The first player to answer in each cell also earns{' '}
          <PointsHighlight type="positive">bonus points</PointsHighlight> equal to the stars of the category
          (column).
        </>
      }
    />
  );
}
