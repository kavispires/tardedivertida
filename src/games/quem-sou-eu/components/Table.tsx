import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { Characters } from '../utils/types';
import { Card } from './Card';

type TableProps = {
  characters: Characters;
  tableOrder: CardId[];
  playerCharacterId: CardId;
  showAll?: boolean;
  imageCardMode: boolean;
};

export function Table({
  characters,
  playerCharacterId,
  tableOrder,
  showAll = true,
  imageCardMode = false,
}: TableProps) {
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 150,
    maxWidth: 200,
  });

  const topKeys = tableOrder.slice(0, Math.floor(tableOrder.length / 2));
  const bottomKeys = tableOrder.slice(Math.floor(tableOrder.length / 2));

  if (!showAll) {
    return (
      <SpaceContainer className="q-table">
        <CharacterCard
          character={characters[playerCharacterId]}
          size={width}
          className="q-character-player"
        />
      </SpaceContainer>
    );
  }

  return (
    <SpaceContainer className="q-table" wrap>
      <SpaceContainer wrap>
        {topKeys.map((key) => (
          <Card
            character={characters[key]}
            key={key}
            width={width}
            imageCardMode={imageCardMode}
            className={clsx(key === playerCharacterId && 'q-character-player')}
          />
        ))}
      </SpaceContainer>
      <SpaceContainer wrap>
        {bottomKeys.map((key) => (
          <Card
            character={characters[key]}
            key={key}
            width={width}
            imageCardMode={imageCardMode}
            className={clsx(key === playerCharacterId && 'q-character-player')}
          />
        ))}
      </SpaceContainer>
    </SpaceContainer>
  );
}
