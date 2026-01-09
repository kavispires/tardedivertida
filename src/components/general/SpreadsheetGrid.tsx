import clsx from 'clsx';
import type { ReactNode } from 'react';
// Sass
import './SpreadsheetGrid.scss';

type SpreadsheetGridProps = {
  /**
   * Number of columns
   */
  columns: number;
  /**
   * Number of rows
   */
  rows: number;
  /**
   * Add the blank top left corner cell
   */
  topLeftCorner?: boolean;
  /**
   * Content of the grid, usually SpreadsheetCell components
   */
  children?: ReactNode;
  /**
   * Custom class name
   */
  className?: string;
};

export function SpreadsheetGrid({ columns, rows, topLeftCorner, children, className }: SpreadsheetGridProps) {
  return (
    <div
      className={clsx('spreadsheet-grid', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, auto)` }}
      role="table"
    >
      {topLeftCorner && <SpreadsheetCell header></SpreadsheetCell>}
      {children}
    </div>
  );
}

type SpreadsheetCellProps = {
  /**
   * The content of the Cell
   */
  children?: ReactNode;
  /**
   * Style cell as header
   */
  header?: boolean;
  /**
   * Custom class name
   */
  className?: string;
};

export function SpreadsheetCell({ children, header, className }: SpreadsheetCellProps) {
  return (
    <span
      className={clsx('spreadsheet-cell', header && 'spreadsheet-cell--header', className)}
      role="cell"
    >
      {children}
    </span>
  );
}
