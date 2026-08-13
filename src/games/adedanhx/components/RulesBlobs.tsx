// Components
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { PointsHighlightV2 } from '@components/metrics/PointsHighlight';

export function ScoringRule() {
  return (
    <TranslateTemplate
      en="Each valid answer earns <points>points</points> according to the stars of its letter (row).<br />The first player to answer in each cell also earns <bonusPoints>bonus points</bonusPoints> equal to the stars of the category (column)."
      pt="Cada resposta válida ganha <points>pontos</points> de acordo com as estrelas sua letra (linha).<br />O primeiro jogador a responder em cada célula, também ganha <bonusPoints>pontos bônus</bonusPoints> igual as estrelas da categoria (coluna)."
      values={{
        points: (content) => (
          <PointsHighlightV2
            value={content}
            omitText
          />
        ),
        bonusPoints: (content) => (
          <PointsHighlightV2
            type="positive"
            value={content}
            omitText
          />
        ),
      }}
    />
  );
}
