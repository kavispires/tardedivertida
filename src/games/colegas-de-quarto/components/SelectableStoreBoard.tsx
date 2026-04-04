import { useMemo } from 'react';
// Ant Design Resources
import { Badge } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { BoardEntry, GuessedPair } from '../utils/types';
import { getTitleForRound } from '../utils/helpers';
import { HouseItem } from './HouseItem';
import { Label } from './Label';

type SelectableStoreBoardProps = {
  board: BoardEntry[];
  round: GameRound;
  guessedPairs: Dictionary<GuessedPair>;
  onSelectEntry: (entryId: string) => void;
};

export function SelectableStoreBoard({
  board,
  round,
  guessedPairs = {},
  onSelectEntry,
}: SelectableStoreBoardProps) {
  const assignmentDictionary = useMemo(() => {
    return Object.values(guessedPairs).reduce((acc: Dictionary<GuessedPair>, pairGuess) => {
      pairGuess.guesses.forEach((id) => {
        acc[id] = pairGuess;
      });
      return acc;
    }, {});
  }, [guessedPairs]);

  return (
    <TitledContainer title={getTitleForRound(round)}>
      <div className="store-board">
        {board.map((entry, index) => (
          <TransparentButton
            onClick={() => onSelectEntry(entry.id)}
            key={entry.id}
          >
            {assignmentDictionary[entry.id] ? (
              <Badge.Ribbon
                text={
                  <Label
                    name={assignmentDictionary[entry.id].playerName}
                    avatarId={assignmentDictionary[entry.id].avatarId}
                    index={assignmentDictionary[entry.id].index}
                    size="small"
                  />
                }
                color={assignmentDictionary[entry.id].color}
                key={entry.id}
              >
                <HouseItem
                  index={index}
                  setId={round.current}
                  text={entry.text}
                  style={{ borderColor: assignmentDictionary[entry.id].color }}
                />
              </Badge.Ribbon>
            ) : (
              <HouseItem
                index={index}
                setId={round.current}
                text={entry.text}
              />
            )}
          </TransparentButton>
        ))}
      </div>
    </TitledContainer>
  );
}
