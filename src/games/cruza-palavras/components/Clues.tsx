// Types
import type { GamePlayer } from 'types/player';
// Internal
import type { Clue } from '../utils/types';
import { getClueKey } from '../utils/helpers';
import { DraggableClue } from './DraggableClue';

type CluesProps = {
  clues: Clue[];
  onActivateClue: (clue: Clue) => void;
  active: Clue | number | null;
  guesses: PlainObject;
  user: GamePlayer;
  clueColors: Dictionary<string>;
};

export function Clues({ clues, clueColors, onActivateClue, active, guesses, user }: CluesProps) {
  // Filter out the player's own clue
  const filteredClues = clues.filter((clueObj) => clueObj.playerId !== user.id);

  return (
    <ul className="x-clue-cards">
      {filteredClues.map((clueObj) => {
        const isSelected = typeof active !== 'number' && clueObj.coordinate === active?.coordinate;
        const isMatched = Boolean(guesses[getClueKey(clueObj)]);

        // Skip rendering if the clue is already placed on the grid (matched)
        if (isMatched) {
          return null;
        }

        return (
          <li
            key={`${clueObj.coordinate}-${clueObj.clue}`}
            className="x-clue-card-li"
          >
            <DraggableClue
              clue={clueObj}
              isSelected={isSelected}
              isMatched={isMatched}
              color={clueColors[clueObj.clue]}
              onActivateClue={onActivateClue}
              // No need to disable here as player's own clue is already filtered out
            />
          </li>
        );
      })}
    </ul>
  );
}
