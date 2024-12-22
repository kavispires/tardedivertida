# Grid Map Toolkit Documentation

## Overview
The **Grid Map Toolkit** provides a set of utilities for creating and manipulating 2D grid maps in TypeScript. It allows you to initialize grids, manage cell states, and perform adjacency-based operations on cells.

### Version: 1.0.0

## Core Functions

### createGridMap
```typescript
function createGridMap<TCellData>(width: number, height: number, options: GridMapOptions<TCellData> = {}): GridMapType<TCellData>
```
Creates a new grid map with optional configuration.

**Parameters:**
- `width` (number): Grid width (number of columns).
- `height` (number): Grid height (number of rows).
- `options` (GridMapOptions): Optional grid configuration.

**Returns:**
- `GridMapType`: A newly initialized grid.

**Example:**
```typescript
const grid = gridMapUtils.createGridMap(10, 10, { origin: 'top-left' });
```

---

### updateCell
```typescript
function updateCell<TCellData>(grid: GridMapType<TCellData>, id: string, newData: TCellData | null, state?: GridMapCellState): GridMapType<TCellData>
```
Updates the data and state of a specific cell.

**Parameters:**
- `grid` (GridMapType): The target grid.
- `id` (string): Cell identifier (e.g., '3-4').
- `newData` (TCellData | null): New data to apply to the cell.
- `state` (GridMapCellState): New state to apply to the cell (optional).

**Returns:**
- `GridMapType`: The updated grid.

**Example:**
```typescript
gridMapUtils.updateCell(grid, '5-5', { value: 'treasure' }, 'used');
```

---

### getCellById
```typescript
function getCellById<TCellData>(grid: GridMapType<TCellData>, id: string): GridMapCellType<TCellData | null> | null
```
Retrieves a cell by its unique identifier.

**Parameters:**
- `grid` (GridMapType): The target grid.
- `id` (string): The cell identifier.

**Returns:**
- `GridMapCellType | null`: The found cell or null if not found.

**Example:**
```typescript
const cell = gridMapUtils.getCellById(grid, '5-5');
```

---

### getCellByCoordinates
```typescript
function getCellByCoordinates<TCellData>(grid: GridMapType<TCellData>, x: number, y: number): GridMapCellType<TCellData | null> | null
```
Finds a cell by its x and y coordinates.

**Parameters:**
- `grid` (GridMapType): The target grid.
- `x` (number): X-coordinate.
- `y` (number): Y-coordinate.

**Returns:**
- `GridMapCellType | null`: The found cell or null.

**Example:**
```typescript
const cell = gridMapUtils.getCellByCoordinates(grid, 5, 5);
```

---

### getOriginId
```typescript
function getOriginId<TCellData>(grid: GridMapType<TCellData>): string | null
```
Retrieves the identifier of the origin cell.

**Parameters:**
- `grid` (GridMapType): The target grid.

**Returns:**
- `string | null`: The ID of the origin cell.

**Example:**
```typescript
const originId = gridMapUtils.getOriginId(grid);
```

---

### createPath
```typescript
function createPath<TCellData>(grid: GridMapType<TCellData>, length: number, startId: string): { id: string; path: string[] } | null
```
Generates a path starting from a specific cell.

**Parameters:**
- `grid` (GridMapType): The target grid.
- `length` (number): Path length.
- `startId` (string): Starting cell ID.

**Returns:**
- `Object | null`: Path object or null if unsuccessful.

**Example:**
```typescript
const path = gridMapUtils.createPath(grid, 3, '0-0');
```

---

### createPaths
```typescript
function createPaths<TCellData>(grid: GridMapType<TCellData | null>, numPaths: number, startIds: string[], pathLength: number, allowRepetition = false): { id: string; path: string[] }[]
```
Creates multiple unique paths on the grid.

**Parameters:**
- `grid` (GridMapType): The target grid.
- `numPaths` (number): Number of paths to create.
- `startIds` (string[]): Array of starting cell IDs.
- `pathLength` (number): Length of each path.
- `allowRepetition` (boolean): Whether cells can be visited multiple times.

**Returns:**
- `Array`: An array of path objects.

**Example:**
```typescript
const paths = gridMapUtils.createPaths(grid, 5, ['0-0', '2-2'], 4);
```

