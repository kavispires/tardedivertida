export const getConeColor = (id: string): string => {
  return (
    {
      A: 'green',
      B: 'red',
      C: 'yellow',
      D: 'purple',
    }?.[id] ?? 'gray'
  );
};
