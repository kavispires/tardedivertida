// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { Item } from 'types/tdr';
// Components
import { PlayerAvatar, PlayerAvatarName } from 'components/avatars';
import { Card } from 'components/cards';
// Internal
import type { GalleryEntry } from '../utils/types';
import { ThingCard } from './ThingCard';

type GalleryCategoryEntryProps = {
  players: GamePlayers;
  entry: GalleryEntry;
  cardsDict: Dictionary<Item>;
};

export function GalleryCategoryEntry({ entry, cardsDict, players }: GalleryCategoryEntryProps) {
  return (
    <Flex
      vertical
      justify="center"
      className="contained"
    >
      <Flex justify="center">
        <Card hideHeader>
          <PlayerAvatar
            avatarId={players[entry.creatorId].avatarId}
            size="small"
          />{' '}
          {entry.category}
        </Card>
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
              name={cardsDict[tableEntry.cardId].name}
              width={100}
            />
            <PlayerAvatarName player={players[tableEntry.playerId]} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
