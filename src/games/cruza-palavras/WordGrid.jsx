import clsx from 'clsx';
import PropTypes from 'prop-types';

function WordGrid({ grid, user, CellComponent, cellComponentProps = {} }) {
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

WordGrid.propTypes = {
  CellComponent: PropTypes.any,
  cellComponentProps: PropTypes.object,
  grid: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.any,
      map: PropTypes.func,
    })
  ),
  user: PropTypes.shape({
    id: PropTypes.string,
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default WordGrid;
