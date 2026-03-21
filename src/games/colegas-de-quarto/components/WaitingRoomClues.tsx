// Ant Design Resources
import { Flex, Input, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Internal
import type { BoardEntry, PlayerAssignedPair } from '../utils/types';
import { PAIR_COLORS, PAIR_ICONS } from '../utils/helpers';
import { HouseItem } from './HouseItem';

type WaitingRoomCluesProps = {
  user: GamePlayer;
  currentRound: number;
  board: BoardEntry[];
};

export function WaitingRoomClues({ user, currentRound, board }: WaitingRoomCluesProps) {
  const assignedPairs: PlayerAssignedPair[] = user?.assignedPairs ?? [];
  const userHouseItems = board.reduce((acc: Dictionary<{ item: BoardEntry; index: number }>, item, index) => {
    if (assignedPairs.some((pair) => pair.ids.includes(item.id))) {
      acc[item.id] = {
        item,
        index,
      };
    }

    return acc;
  }, {});

  if (!assignedPairs.length) {
    return null;
  }

  return (
    <Space>
      {assignedPairs.map((assignedPair, index) => (
        <Space
          vertical
          key={assignedPair.id}
        >
          <Flex gap={6}>
            <HouseItem
              text={userHouseItems[assignedPair.ids[0]]?.item.text}
              index={userHouseItems[assignedPair.ids[0]]?.index ?? index}
              setId={currentRound}
            />
            <HouseItem
              text={userHouseItems[assignedPair.ids[1]]?.item.text}
              index={userHouseItems[assignedPair.ids[1]]?.index ?? index}
              setId={currentRound}
            />
          </Flex>
          <Space.Compact>
            <Space.Addon style={{ backgroundColor: PAIR_COLORS[index], color: 'white' }}>
              {PAIR_ICONS[index]}
            </Space.Addon>

            <Input
              value={user?.clues?.[index]}
              readOnly
            />
          </Space.Compact>
        </Space>
      ))}
    </Space>
  );
}
