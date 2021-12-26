import clsx from 'clsx';
// Utils
import { getEntryId } from '../../utils/helpers';
// Components
import { CanvasSVG } from '../../components';
import Ribbon from './Ribbon';

type EvaluationAllDrawingsProps = {
  drawings: ArteRuimDrawing[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
  canvasSize: number;
  players: GamePlayers;
};
function EvaluationAllDrawings({
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
        return (
          <li
            key={canvasEntryId}
            className={clsx(liButtonBaseClass, isActive && `${liButtonBaseClass}--active`)}
            onClick={() => onActivateItem(canvasEntryId)}
          >
            {votes?.[canvasEntryId] && <Ribbon cardEntryId={votes[canvasEntryId]} />}
            <CanvasSVG
              drawing={drawingEntry.drawing}
              className="a-evaluation-all-drawings__drawing"
              size={canvasSize}
            />
            <span className="a-evaluation-all-drawings__artist">{players[drawingEntry.playerId].name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default EvaluationAllDrawings;
