import { useMemo } from "react";
// Types
import type { GamePlayers } from "types/player";
// Hooks
import { useGlobalLocalStorage } from "hooks/useGlobalLocalStorage";
// Icons
import { AnimatedLoaderIcon } from "icons/AnimatedLoaderIcon";
// Components
import { AvatarName } from "components/avatars";
import { IconAvatar } from "components/avatars/IconAvatar";
import { CanvasSVG } from "components/canvas";
// Internal
import type { ArteRuimCard, ArteRuimDrawing } from "../utils/types";

type EvaluatedDrawingsProps = {
  votes?: StringDictionary;
  cards: ArteRuimCard[];
  drawings: ArteRuimDrawing[];
  players: GamePlayers;
};

/**
 * Displays drawings in the waiting room after evaluation
 * @param props
 * @returns
 */
export function EvaluatedDrawings({
  votes,
  cards,
  drawings,
  players,
}: EvaluatedDrawingsProps) {
  const [canvasSize] = useGlobalLocalStorage("canvasSize");

  const cardsDict = useMemo(
    () =>
      cards.reduce((acc: Record<string, ArteRuimCard>, card) => {
        acc[card.id] = card;
        return acc;
      }, {}),
    [cards],
  );

  const drawingsDict = useMemo(
    () =>
      drawings.reduce((acc: Record<string, ArteRuimDrawing>, drawing) => {
        acc[drawing.id] = drawing;
        return acc;
      }, {}),
    [drawings],
  );

  if (!votes) {
    return (
      <div className="a-evaluated-drawings">
        <IconAvatar icon={<AnimatedLoaderIcon />} />
      </div>
    );
  }
  const cSize = Math.min(canvasSize * 0.6, 2000);

  return (
    <ul className="a-evaluated-drawings">
      {Object.keys(votes)
        .sort()
        .map((drawingKey: string) => {
          const drawing = drawingsDict[drawingKey] as ArteRuimDrawing;
          const card = cardsDict[votes[drawingKey]] as ArteRuimCard;

          return (
            <li
              className="a-evaluated-drawings__item"
              key={`${drawing.id}-${card.id}-${card.playerId}`}
            >
              <div
                className="a-evaluated-drawings__card"
                style={{ maxWidth: `${cSize}px` }}
              >
                <AvatarName player={players[drawing.playerId]} size="small" />
              </div>
              <CanvasSVG
                drawing={drawing.drawing}
                width={cSize}
                className="a-evaluation-all-drawings__drawing"
              />
              <div
                className="a-evaluated-drawings__card"
                style={{ maxWidth: `${cSize}px` }}
              >
                {card.text}
              </div>
            </li>
          );
        })}
    </ul>
  );
}
