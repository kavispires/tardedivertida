export const COLS = 3;

export const getPieceStyle = (
  pieceId: number,
  imageUrl: string | undefined,
  totalRows: number,
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#2d2d2d',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  if (!imageUrl) return baseStyle;

  const col = pieceId % COLS;
  const row = Math.floor(pieceId / COLS);

  // Calculate the background position based on the grid position
  const xPercent = COLS > 1 ? (col / (COLS - 1)) * 100 : 0;
  const yPercent = totalRows > 1 ? (row / (totalRows - 1)) * 100 : 0;

  return {
    ...baseStyle,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${COLS * 100}% ${totalRows * 100}%`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
  };
};

export const arePiecesConnectable = (idA: number, idB: number, isHorizontal: boolean) => {
  if (isHorizontal) {
    return idB === idA + 1 && Math.floor(idA / COLS) === Math.floor(idB / COLS);
  }
  return idB === idA + COLS;
};
