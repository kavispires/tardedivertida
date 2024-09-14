import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromLetter, getEntryId } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
// Internal
import type { Dream } from '../utils/types';

type AllDreamsCluesProps = {
  dreams: Dream[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: StringDictionary;
  players: GamePlayers;
};

export function AllDreamsClues({ dreams, activeItem, onActivateItem, votes, players }: AllDreamsCluesProps) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <Space className="space-container">
      {dreams.map(({ id, dream }, index) => {
        const player = players[id];
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(['dream', id, letter]);
        const isActive = activeItem === cardEntryId;
        const isUsed = Object.keys(votes).includes(cardEntryId);

        return (
          <TransparentButton
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
          </TransparentButton>
        );
      })}
    </Space>
  );
}
