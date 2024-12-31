import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import { SIDES } from '../utils/constants';
import type { DeckEntry } from '../utils/types';

type BoardEntryProps = {
  entry: DeckEntry;
  deckType: string;
  userSide: string;
};
export function BoardEntry({ entry, deckType, userSide }: BoardEntryProps) {
  const { dualTranslate } = useLanguage();

  const sideIndex = SIDES.indexOf(userSide);

  if (deckType === 'items') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <ItemCard
          id={`${entry.data.id}`}
          title={entry.data.name ? dualTranslate(entry.data.name) : undefined}
        />
      </div>
    );
  }

  return <div className="cd-board-entry">{entry.id}</div>;
}
