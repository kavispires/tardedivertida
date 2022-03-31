import clsx from 'clsx';
// Constants
import { LETTERS } from 'utils/constants';
// Utils
import { getColorFromLetter, getEntryId } from 'utils/helpers';
// Components
import { Card } from 'components';

type AllDreamsCluesProps = {
  dreams: SDream[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: StringDictionary;
  players: GamePlayers;
};

export function AllDreamsClues({ dreams, activeItem, onActivateItem, votes, players }: AllDreamsCluesProps) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <ul className="a-evaluation-all-cards">
      {dreams.map(({ id, dream }, index) => {
        const player = players[id];
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(['dream', id, letter]);
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
              color={getColorFromLetter(letter)}
              header={letter}
              size="medium"
              footer={player.name}
              className="s-clue-card"
              footerClassName="s-clue-card__footer"
            >
              {dream}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
