import clsx from 'clsx';
// Types
import type { ContenderCard, SuspectCard as SuspectCardType, TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Card } from '@components/cards/Card';
import { CharacterCard } from '@components/cards/CharacterCard';
import { ItemCard } from '@components/cards/ItemCard';
import { SuspectCard } from '@components/cards/SuspectCard';
import { ImageCard } from '@components/image-cards/ImageCard';
// Internal
import type { DeckEntry } from '../utils/types';
import { SIDES } from '../utils/constants';

type HistoryDeliverableEntryProps = {
  deliverable: DeckEntry;
  deckType: string;
  userSide: string;
};

export function HistoryDeliverableEntry({ deliverable, deckType, userSide }: HistoryDeliverableEntryProps) {
  const { translate } = useLanguage();

  const sideIndex = SIDES.indexOf(userSide);

  if (!deliverable.data) {
    return (
      <div
        key={`cd-history-entry-${deliverable.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        {deliverable.id}
      </div>
    );
  }

  if (deckType === 'items' && deliverable.data.type === 'item') {
    const itemData = deliverable.data;
    return (
      <div
        key={`cd-history-entry-${itemData.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <ItemCard
          itemId={`${itemData.id}`}
          title={itemData.name ? translate(itemData.name) : undefined}
          width={64}
        />
      </div>
    );
  }

  if (deckType === 'images' && deliverable.data.type === 'image') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <ImageCard
          cardId={deliverable.data.id}
          cardWidth={48}
          className="history-entry-image-card"
        />
      </div>
    );
  }

  if (deckType === 'contenders' && deliverable.data.type === 'contender') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <CharacterCard
          character={deliverable.data as unknown as ContenderCard}
          size={96}
          className="history-entry-image-card"
        />
      </div>
    );
  }

  if (deckType === 'suspects' && deliverable.data.type === 'suspect') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <SuspectCard
          suspect={deliverable.data as unknown as SuspectCardType}
          width={72}
          hideName
        />
      </div>
    );
  }

  if (deckType === 'words' && deliverable.data.type === 'word') {
    return (
      <div
        key={`cd-history-entry-${deliverable.data.id}`}
        className={clsx('cd-history-entry', `cd-history-entry--${deliverable.affiliation[sideIndex]}`)}
      >
        <Card hideHeader>{(deliverable.data as unknown as TextCard).text}</Card>
      </div>
    );
  }

  return <div className="cd-board-entry">{deliverable.id}</div>;
}
