import clsx from 'clsx';
// Utils
import { LETTERS } from '../../utils/constants';
import { getEntryId } from '../../utils/helpers';
// Components
import { SonhosPesadelosCard as Card } from './Card';

type AllCluesProps = {
  clues: SClue[];
  activeItem: any;
  onActivateItem: GenericFunction;
  votes: any;
  players: GamePlayers;
  currentRound: number;
};

export function AllClues({ clues, activeItem, onActivateItem, votes, players, currentRound }: AllCluesProps) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <ul className="a-evaluation-all-cards">
      {clues.map(({ cardId, clue, playerId }, index) => {
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(['clue', cardId, letter]);
        const isActive = activeItem === cardEntryId;
        const isUsed = Object.keys(votes).includes(cardEntryId);

        return (
          <li
            role="button"
            key={cardEntryId}
            className={clsx(
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`,
              isUsed && `${liButtonBaseClass}--used`
            )}
            onClick={() => onActivateItem(cardEntryId)}
          >
            <Card
              clue={clue[0]}
              header={letter}
              footer={players[playerId].name}
              previousClues={currentRound > 3 ? [clue.slice(1)] : []}
            />
          </li>
        );
      })}
    </ul>
  );
}
