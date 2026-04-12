import clsx from 'clsx';
// Types
import type { GamePlayers } from 'types/game';
import type { Item } from 'types/tdr';
// Components
import { DivButton } from 'components/buttons/DivButton';
import { ItemCard } from 'components/cards/ItemCard';
import { AvatarGroup } from 'components/players/PlayerAvatarGroup';

type ItemsGridProps = {
  items: Item[];
  targets?: string[];
  onItemSelect?: (item: string) => void;
  selectedItems?: string[];
  results?: {
    guessPlayersPerItem: Record<string, UID[]>;
    players: GamePlayers;
  };
  displayRealNames?: boolean;
};

export function ItemsGrid({
  items,
  targets,
  onItemSelect,
  selectedItems,
  results,
  displayRealNames,
}: ItemsGridProps) {
  return (
    <div className="items-grid">
      {items.map((item) => {
        const isSelected = selectedItems?.includes(item.id);
        const isTarget = targets?.includes(item.id);

        return (
          <DivButton
            key={item.id}
            className={clsx('items-grid__item', {
              'items-grid__item-selected': isSelected,
              'items-grid__item-target': isTarget,
            })}
            onClick={() => onItemSelect?.(item.id)}
          >
            <ItemCard
              itemId={item.id}
              className="item-forced-outline"
              width={100}
              text={displayRealNames ? item.name : undefined}
            />
            {results?.guessPlayersPerItem[item.id] && (
              <div className="items-grid__players-guesses">
                <AvatarGroup
                  list={results.guessPlayersPerItem[item.id].map((playerId) => results.players[playerId])}
                  maxCount={3}
                  size="small"
                />
              </div>
            )}
          </DivButton>
        );
      })}
    </div>
  );
}
