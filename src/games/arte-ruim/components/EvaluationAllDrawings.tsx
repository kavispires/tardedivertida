import clsx from 'clsx';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getEntryId } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { Ribbon } from 'components/ribbons';
// Internal
import type { ArteRuimDrawing } from '../utils/types';

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

            <span className="a-evaluation-all-drawings__artist">
              <AvatarName player={players[drawingEntry.playerId]} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
