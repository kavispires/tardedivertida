import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';

type TableProps = {
  characters: Characters;
  tableOrder: CardId[];
  playerCharacterId: CardId;
  showAll?: boolean;
};

export function Table({ characters, playerCharacterId, tableOrder, showAll = true }: TableProps) {
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 150,
    maxWidth: 200,
  });

  const topKeys = tableOrder.slice(0, Math.floor(tableOrder.length / 2));
  const bottomKeys = tableOrder.slice(Math.floor(tableOrder.length / 2));

  if (!showAll) {
    return (
      <Space className="space-container q-table">
        <CharacterCard
          character={characters[playerCharacterId]}
          size={width}
          className="q-character-player"
        />
      </Space>
    );
  }

  return (
    <Space className="space-container q-table" wrap>
      <Space className="space-container" wrap>
        {topKeys.map((key) => (
          <CharacterCard
            character={characters[key]}
            key={key}
            size={width}
            className={clsx(key === playerCharacterId && 'q-character-player')}
          />
        ))}
      </Space>
      <Space className="space-container" wrap>
        {bottomKeys.map((key) => (
          <CharacterCard
            character={characters[key]}
            key={key}
            size={width}
            className={clsx(key === playerCharacterId && 'q-character-player')}
          />
        ))}
      </Space>
    </Space>
  );
}
