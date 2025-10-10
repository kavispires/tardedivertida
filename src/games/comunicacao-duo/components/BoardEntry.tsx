import clsx from 'clsx';
// Types
import type { ContenderCard, SuspectCard as SuspectCardType, TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { ItemCard } from 'components/cards/ItemCard';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
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
          itemId={`${entry.data.id}`}
          title={entry.data.name ? dualTranslate(entry.data.name) : undefined}
        />
      </div>
    );
  }

  if (deckType === 'images') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <ImageCard id={entry.data.id} cardWidth={72} className="board-entry-image-card" />
      </div>
    );
  }

  if (deckType === 'contenders') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <CharacterCard character={entry.data as ContenderCard} size={96} className="board-entry-image-card" />
      </div>
    );
  }

  if (deckType === 'suspects') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <SuspectCard suspect={entry.data as SuspectCardType} width={72} hideName />
      </div>
    );
  }

  if (deckType === 'words') {
    return (
      <div
        key={`cd-board-entry-${entry.data.id}`}
        className={clsx('cd-board-entry', `cd-board-entry--${entry.affiliation[sideIndex]}`)}
      >
        <Card hideHeader>{(entry.data as TextCard).text}</Card>
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
