import clsx from 'clsx';
// Types
import type { ArteRuimDrawing } from '../utils/types';
// Utils
import { getEntryId } from 'utils/helpers';
// Components
import { CanvasSVG } from 'components/canvas';
import { Ribbon } from 'components/ribbons';

type EvaluationAllDrawingsProps = {
  drawings: ArteRuimDrawing[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
  canvasSize: number;
  players: GamePlayers;
};

export function EvaluationAllDrawings({
  drawings,
  activeItem,
  onActivateItem,
  votes,
  canvasSize,
  players,
}: EvaluationAllDrawingsProps) {
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="a-evaluation-all-drawings">
      {drawings?.map((drawingEntry) => {
        const canvasEntryId = getEntryId(['drawing', drawingEntry.id]);
        const isActive = activeItem === canvasEntryId;
        const vote = votes[canvasEntryId];

        return (
          <li
            key={`${canvasEntryId}-${drawingEntry.playerId}`}
            className={clsx(liButtonBaseClass, isActive && `${liButtonBaseClass}--active`)}
            onClick={() => onActivateItem(canvasEntryId)}
          >
            {votes?.[canvasEntryId] && <Ribbon label={vote.charAt(vote.length - 1)} />}
            <CanvasSVG
              drawing={drawingEntry.drawing}
              className="a-evaluation-all-drawings__drawing"
              width={canvasSize}
            />
            <span className="a-evaluation-all-drawings__artist">{players[drawingEntry.playerId].name}</span>
          </li>
        );
      })}
    </ul>
  );
}
