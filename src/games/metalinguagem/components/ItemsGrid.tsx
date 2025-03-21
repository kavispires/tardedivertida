import clsx from 'clsx';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { AvatarGroup } from 'components/avatars/AvatarGroup';
import { ItemCard } from 'components/cards/ItemCard';

type ItemsGridProps = {
  items: string[];
  targets?: string[];
  onItemSelect?: (item: string) => void;
  selectedItems?: string[];
  results?: {
    guessPlayersPerItem: Record<string, PlayerId[]>;
    players: GamePlayers;
  };
};

export function ItemsGrid({ items, targets, onItemSelect, selectedItems, results }: ItemsGridProps) {
  return (
    <div className="items-grid">
      {items.map((itemId) => {
        const isSelected = selectedItems?.includes(itemId);
        const isTarget = targets?.includes(itemId);

        return (
          <div
            key={itemId}
            className={clsx('items-grid__item', {
              'items-grid__item-selected': isSelected,
              'items-grid__item-target': isTarget,
            })}
            onClick={() => onItemSelect?.(itemId)}
          >
            <ItemCard id={itemId} className="item-forced-outline" width={100} />
            {results?.guessPlayersPerItem[itemId] && (
              <div className="items-grid__players-guesses">
                <AvatarGroup
                  list={results.guessPlayersPerItem[itemId].map((playerId) => results.players[playerId])}
                  maxCount={3}
                  size="small"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
