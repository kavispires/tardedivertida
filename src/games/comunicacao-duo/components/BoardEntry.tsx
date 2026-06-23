import clsx from 'clsx';
// Types
import type { ContenderCard, SuspectCard as SuspectCardType } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Card } from '@components/cards/Card';
import { CharacterCard } from '@components/cards/CharacterCard';
import { ItemCard } from '@components/cards/ItemCard';
import { SuspectCard } from '@components/cards/SuspectCard';
import { ImageCard } from '@components/image-cards/ImageCard';
// Internal
import { SIDES } from '../utils/constants';
import type { DeckEntry } from '../utils/types';

type BoardEntryProps = {
  entry: DeckEntry;
  deckType: string;
  userSide: string;
};
export function BoardEntry({ entry, deckType, userSide }: BoardEntryProps) {
  const { translate } = useLanguage();

  const sideIndex = SIDES.indexOf(userSide);

  if (!entry.data) {
    return (
      <div
        key={`cd-board-entry-${entry.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        {entry.id}
      </div>
    );
  }

  if (deckType === 'items' && entry.data.type === 'item') {
    const itemData = entry.data;
    return (
      <div
        key={`cd-board-entry-${itemData.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <ItemCard
          itemId={`${itemData.id}`}
          title={itemData.name ? translate(itemData.name) : undefined}
        />
      </div>
    );
  }

  if (deckType === 'images' && entry.data.type === 'image') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <ImageCard
          cardId={entry.data.id}
          cardWidth={72}
          className="board-entry-image-card"
        />
      </div>
    );
  }

  if (deckType === 'contenders' && entry.data.type === 'contender') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <CharacterCard
          character={entry.data as unknown as ContenderCard}
          size={96}
          className="board-entry-image-card"
        />
      </div>
    );
  }

  if (deckType === 'suspects' && entry.data.type === 'suspect') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <SuspectCard
          suspect={entry.data as unknown as SuspectCardType}
          width={72}
          hideName
        />
      </div>
    );
  }

  if (deckType === 'words' && entry.data.type === 'word') {
    const wordData = entry.data;
    return (
      <div
        key={`cd-board-entry-${wordData.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <Card hideHeader>{translate(wordData.text)}</Card>
      </div>
    );
  }

  return (
    <div
      key={`cd-board-entry-${entry.id}`}
      className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
    >
      {entry.id}
    </div>
  );
}
