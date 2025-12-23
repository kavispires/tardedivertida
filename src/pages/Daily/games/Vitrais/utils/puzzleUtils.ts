import { random, shuffle } from 'lodash';
// Internal
import type { DailyVitraisEntry, Piece, Point } from './types';

const MAX_PIECE_SIZE = 7;

/**
 * Generates a deterministic puzzle matching the DailyVitraisEntry schema.
 */
export const generatePuzzleData = (
  cardId: string,
  title = 'Demo',
  targetPieceCount = 12,
  gridCols = 6,
): DailyVitraisEntry => {
  // 1. Setup Grid
  const safeTarget = Math.max(9, Math.min(24, targetPieceCount));
  const gridRows = Math.round(gridCols * 1.5);

  // Initialize Grid: Start with every cell as its own 1x1 piece
  const pieceMap: number[][] = [];
  const piecesList: { id: number; blocks: Point[] }[] = [];
  let nextId = 0;

  for (let y = 0; y < gridRows; y++) {
    const row: number[] = [];
    for (let x = 0; x < gridCols; x++) {
      row.push(nextId);
      piecesList.push({ id: nextId, blocks: [{ x, y }] });
      nextId++;
    }
    pieceMap.push(row);
  }

  // 2. Merging Logic (Smallest First Strategy)
  let stuckCounter = 0;

  while (piecesList.length > safeTarget) {
    if (stuckCounter > 50) break;

    // Find smallest size
    let minSize = Number.POSITIVE_INFINITY;
    piecesList.forEach((p) => {
      if (p.blocks.length < minSize) minSize = p.blocks.length;
    });

    const candidates = shuffle(piecesList.filter((p) => p.blocks.length === minSize));
    let merged = false;

    for (const piece of candidates) {
      const validNeighborIds = new Set<number>();

      piece.blocks.forEach((block) => {
        const dirs = [
          { x: block.x + 1, y: block.y },
          { x: block.x - 1, y: block.y },
          { x: block.x, y: block.y + 1 },
          { x: block.x, y: block.y - 1 },
        ];

        dirs.forEach((d) => {
          if (d.x >= 0 && d.x < gridCols && d.y >= 0 && d.y < gridRows) {
            const neighborId = pieceMap[d.y][d.x];
            if (neighborId !== piece.id) {
              const neighbor = piecesList.find((p) => p.id === neighborId);
              if (neighbor && piece.blocks.length + neighbor.blocks.length <= MAX_PIECE_SIZE) {
                validNeighborIds.add(neighborId);
              }
            }
          }
        });
      });

      if (validNeighborIds.size > 0) {
        const neighborsArray = Array.from(validNeighborIds);
        const targetNeighborId = neighborsArray[random(0, neighborsArray.length - 1)];
        const targetNeighborIdx = piecesList.findIndex((p) => p.id === targetNeighborId);

        const neighborPiece = piecesList[targetNeighborIdx];

        // Merge
        piece.blocks = [...piece.blocks, ...neighborPiece.blocks];
        neighborPiece.blocks.forEach((b) => {
          pieceMap[b.y][b.x] = piece.id;
        });

        piecesList.splice(targetNeighborIdx, 1);
        merged = true;
        break;
      }
    }

    if (merged) stuckCounter = 0;
    else {
      stuckCounter++;
      // Fallback: try merging any piece if smallest fails
      if (stuckCounter > 5) {
        // const fallbackCandidates = shuffle(piecesList);
        // ... (simplified logic: just let loop retry or break if truly stuck)
      }
    }
  }

  // 3. Transform to DailyVitraisEntry format
  const finalPieces: Piece[] = piecesList.map((p, index) => {
    // Sort to find anchor (top-left)
    p.blocks.sort((a, b) => a.y - b.y || a.x - b.x);
    const anchor = p.blocks[0];

    // Convert anchor {x, y} to flat index
    const correctPosIndex = anchor.y * gridCols + anchor.x;

    const shape = p.blocks.map((b) => ({
      x: b.x - anchor.x,
      y: b.y - anchor.y,
    }));

    return {
      id: `piece-${index}`,
      correctPos: correctPosIndex,
      shape,
    };
  });

  // 4. Find Starting Piece (Center Logic)
  const centerX = gridCols / 2;
  const centerY = gridRows / 2;
  let startingPieceId = finalPieces[0]?.id || '';
  let minDistance = Number.POSITIVE_INFINITY;

  finalPieces.forEach((p) => {
    // Reconstruct coordinate from index
    const pX = p.correctPos % gridCols;
    const pY = Math.floor(p.correctPos / gridCols);

    // Calculate center of mass of the piece
    let sumX = 0;
    let sumY = 0;
    p.shape.forEach((b) => {
      sumX += pX + b.x;
      sumY += pY + b.y;
    });
    const pieceCenterX = sumX / p.shape.length;
    const pieceCenterY = sumY / p.shape.length;

    const dist = Math.sqrt((pieceCenterX - centerX) ** 2 + (pieceCenterY - centerY) ** 2);

    if (dist < minDistance) {
      minDistance = dist;
      startingPieceId = p.id;
    }
  });

  return {
    id: '',
    number: 0,
    type: 'vitrais',
    title,
    cardId: cardId,
    gridCols,
    gridRows,
    startingPieceId,
    pieces: finalPieces,
  };
};
