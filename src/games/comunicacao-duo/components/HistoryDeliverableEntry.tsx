import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import type { DeckEntry } from '../utils/types';
import { SIDES } from '../utils/constants';

type HistoryDeliverableEntryProps = {
  deliverable: DeckEntry;
  deckType: string;
  userSide: string;
};

export function HistoryDeliverableEntry({ deliverable, deckType, userSide }: HistoryDeliverableEntryProps) {
  const { dualTranslate } = useLanguage();

  const sideIndex = SIDES.indexOf(userSide);

  if (deckType === 'items') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <ItemCard
          id={`${deliverable.data.id}`}
          title={deliverable.data.name ? dualTranslate(deliverable.data.name) : undefined}
          width={64}
        />
      </div>
    );
  }

  return <div className="cd-board-entry">{deliverable.id}</div>;
}
