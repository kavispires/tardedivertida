import clsx from 'clsx';

type WordGridProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  CellComponent: any;
  cellComponentProps: any;
};

function WordGrid({ grid, user, CellComponent, cellComponentProps = {} }: WordGridProps) {
  const length = Math.sqrt(grid.length);

  const gridStyle = {
    gridTemplateColumns: `repeat(${length}, 1fr)`,
    gridTemplateRows: `repeat(${length}, auto)`,
  };

  return (
    <div className="x-grid" style={gridStyle}>
      {grid.map((cell) => (
        <div className={clsx('x-grid-cell', `x-grid-cell--${cell.kind}`)} key={`${cell.index}-${cell.kind}`}>
          {cell.kind === 'header' && cell.text}

          {cell.kind === 'cell' && <CellComponent {...cellComponentProps} cell={cell} user={user} />}
        </div>
      ))}
    </div>
  );
}

export default WordGrid;
