import clsx from 'clsx';
// Types
import type { ContenderCard, TextCard, SuspectCard as SuspectCardType } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { ItemCard } from 'components/cards/ItemCard';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
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
          itemId={`${deliverable.data.id}`}
          title={deliverable.data.name ? dualTranslate(deliverable.data.name) : undefined}
          width={64}
        />
      </div>
    );
  }

  if (deckType === 'images') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <ImageCard cardId={deliverable.data.id} cardWidth={48} className="history-entry-image-card" />
      </div>
    );
  }

  if (deckType === 'contenders') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <CharacterCard
          character={deliverable.data as ContenderCard}
          size={96}
          className="history-entry-image-card"
        />
      </div>
    );
  }

  if (deckType === 'suspects') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <SuspectCard suspect={deliverable.data as SuspectCardType} width={72} hideName />
      </div>
    );
  }

  if (deckType === 'words') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <Card hideHeader>{(deliverable.data as TextCard).text}</Card>
      </div>
    );
  }

  return <div className="cd-board-entry">{deliverable.id}</div>;
}
