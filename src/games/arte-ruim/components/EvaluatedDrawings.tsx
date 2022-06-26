import { useMemo } from 'react';
// Hooks
import { useGlobalState } from 'hooks';
// Components
import { AvatarIcon } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';

type EvaluatedDrawingsProps = {
  votes?: StringDictionary;
  cards: ArteRuimCard[];
  drawings: ArteRuimDrawing[];
};

/**
 * Displays drawings in the waiting room after evaluation
 * @param props
 * @returns
 */
export function EvaluatedDrawings({ votes, cards, drawings }: EvaluatedDrawingsProps) {
  const [canvasSize] = useGlobalState('canvasSize');

  const cardsDict = useMemo(
    () =>
      cards.reduce((acc: ObjectDictionary, card) => {
        acc[card.id] = card;
        return acc;
      }, {}),
    [cards]
  );

  const drawingsDict = useMemo(
    () =>
      drawings.reduce((acc: ObjectDictionary, drawing) => {
        acc[drawing.id] = drawing;
        return acc;
      }, {}),
    [drawings]
  );

  if (!votes) {
    return (
      <div className="a-evaluated-drawings">
        <AvatarIcon type="animated-loader" />
      </div>
    );
  }
  const cSize = Math.min(canvasSize * 0.6, 2000);

  return (
    <ul className="a-evaluated-drawings">
      {Object.keys(votes).map((drawingKey) => {
        const drawing = drawingsDict[drawingKey] as ArteRuimDrawing;
        const card = cardsDict[votes[drawingKey]] as ArteRuimCard;

        return (
          <li className="a-evaluated-drawings__item" key={`${drawing.id}-${card.id}`}>
            <CanvasSVG
              drawing={drawing.drawing}
              size={cSize}
              className="a-evaluation-all-drawings__drawing"
            />
            <div className="a-evaluated-drawings__card" style={{ maxWidth: `${cSize}px` }}>
              {card.text}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
