export const getClueId = (votes: PlainObject, cardEntryId: string) => {
  return Object.keys(votes).find((key) => votes[key] === cardEntryId);
};

export const shouldDisplayCard = (currentRound: number, entry: STableEntry, userId: PlayerId): boolean => {
  return currentRound > 1 || entry.dreamer === userId || entry.nightmares.includes(userId);
};
