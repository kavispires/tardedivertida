// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { BoardEntry } from '../utils/types';
import { HouseItem } from './HouseItem';

type StoreBoardProps = {
  board: BoardEntry[];
  round: GameRound;
};

export function StoreBoard({ board, round }: StoreBoardProps) {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Loja de Coisas"
          en="Thing Store"
        />
      }
    >
      <div className="store-board">
        {board.map((entry, index) => (
          <div
            key={entry.id}
            className="
            store-board__item"
          >
            <HouseItem
              index={index}
              setId={round.current}
            />
            <div className="store-board__item-text">{entry.text}</div>
          </div>
        ))}
      </div>
    </TitledContainer>
  );
}
