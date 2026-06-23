// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
import type { ItemData } from 'types/tdr';
// Components
import { TextCard } from '@components/cards/TextCard';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import type { GalleryEntry } from '../utils/types';
import { ThingCard } from './ThingCard';

type GalleryCategoryEntryProps = {
  players: GamePlayers;
  entry: GalleryEntry;
  cardsDict: Dictionary<ItemData>;
};

export function GalleryCategoryEntry({ entry, cardsDict, players }: GalleryCategoryEntryProps) {
  return (
    <Flex
      vertical
      justify="center"
      className="contained"
    >
      <Flex justify="center">
        <TextCard>
          <PlayerAvatar
            avatarId={players[entry.creatorId].avatarId}
            size="small"
          />{' '}
          {entry.category}
        </TextCard>
      </Flex>
      <Flex
        justify="center"
        gap={3}
        wrap="wrap"
      >
        {entry.items.map((tableEntry) => (
          <Flex
            key={`${tableEntry.playerId}-${tableEntry.cardId}`}
            orientation="vertical"
            gap={8}
            align="center"
          >
            <ThingCard
              itemId={tableEntry.cardId}
              name={cardsDict?.[tableEntry.cardId]?.name ?? { pt: '', en: '' }}
              width={100}
            />
            <PlayerAvatarName player={players[tableEntry.playerId]} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
