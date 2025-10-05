import type { ElementType } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { SpreadsheetCell, SpreadsheetGrid } from 'components/general/SpreadsheetGrid';
// Internal
import type { Grid, GridType } from '../utils/types';
import { WordGridHeader } from './WordGridHeader';

type WordGridProps = {
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  CellComponent: ElementType;
  cellComponentProps: any;
};

export function WordGrid({ grid, user, CellComponent, gridType, cellComponentProps = {} }: WordGridProps) {
  const length = Math.sqrt(grid.length);

  return (
    <SpreadsheetGrid columns={length} rows={length}>
      {grid.map((cell) => (
        <SpreadsheetCell key={`${cell.index}-${cell.kind}`} header={cell.kind === 'header'}>
          {cell.kind === 'header' && <WordGridHeader cell={cell} gridType={gridType} />}

          {cell.kind === 'cell' && <CellComponent {...cellComponentProps} cell={cell} user={user} />}
        </SpreadsheetCell>
      ))}
    </SpreadsheetGrid>
  );
}
