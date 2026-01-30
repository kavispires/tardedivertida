import { useMemo } from 'react';
// Ant Design Resources
import { Badge } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Components
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { BoardEntry, PlayerAssignedPair } from '../utils/types';
import { getTitleForRound, PAIR_COLORS, PAIR_ICONS } from '../utils/helpers';
import { HouseItem } from './HouseItem';

type StoreBoardProps = {
  board: BoardEntry[];
  round: GameRound;
  assignedPairs: PlayerAssignedPair[];
};

export function StoreBoard({ board, round, assignedPairs = [] }: StoreBoardProps) {
  const assignmentDictionary = useMemo(() => {
    return assignedPairs.reduce((acc: Dictionary<{ icon: React.ReactNode; color: string }>, pair, index) => {
      pair.ids.forEach((id) => {
        acc[id] = {
          icon: PAIR_ICONS[index % 2],
          color: PAIR_COLORS[index % 2],
        };
      });

      return acc;
    }, {});
  }, [assignedPairs]);

  return (
    <TitledContainer title={getTitleForRound(round)}>
      <div className="store-board">
        {board.map((entry, index) => (
          <>
            {assignmentDictionary[entry.id] ? (
              <Badge.Ribbon
                text={assignmentDictionary[entry.id].icon}
                color={assignmentDictionary[entry.id].color}
                key={entry.id}
              >
                <HouseItem
                  style={{ borderColor: assignmentDictionary[entry.id].color }}
                  text={entry.text}
                  index={index}
                  setId={round.current}
                />
              </Badge.Ribbon>
            ) : (
              <HouseItem
                text={entry.text}
                index={index}
                setId={round.current}
              />
            )}
          </>
        ))}
      </div>
    </TitledContainer>
  );
}
