import clsx from 'clsx';
// Types
import type { Grid, GridType } from '../utils/types';
// Components
import { WordGridHeader } from './WordGridHeader';

type WordGridProps = {
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  CellComponent: any;
  cellComponentProps: any;
};

export function WordGrid({ grid, user, CellComponent, gridType, cellComponentProps = {} }: WordGridProps) {
  const length = Math.sqrt(grid.length);

  const gridStyle = {
    gridTemplateColumns: `repeat(${length}, 1fr)`,
    gridTemplateRows: `repeat(${length}, auto)`,
  };

  return (
    <div className="x-grid" style={gridStyle}>
      {grid.map((cell) => (
        <div className={clsx('x-grid-cell', `x-grid-cell--${cell.kind}`)} key={`${cell.index}-${cell.kind}`}>
          {cell.kind === 'header' && <WordGridHeader cell={cell} gridType={gridType} />}

          {cell.kind === 'cell' && <CellComponent {...cellComponentProps} cell={cell} user={user} />}
        </div>
      ))}
    </div>
  );
}
