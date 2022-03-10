import { getLastItem, getRandomItem, shuffle } from 'utils/helpers';

export const mockCrime = (itemsGroup: string[]): SubmitCrimePayload => {
  const shuffledItems = shuffle(itemsGroup);
  const weapon = shuffledItems.find((e) => e?.includes('wp'));
  const evidence = shuffledItems.find((e) => e?.includes('ev'));
  const locationTileId = `location-tile-${getRandomItem([1, 2, 3, 4])}`;
  const options = [0, 1, 2, 3, 4, 5];

  return {
    weaponId: weapon,
    evidenceId: evidence,
    causeOfDeath: getRandomItem(options),
    reasonForEvidence: getRandomItem(options),
    locationTile: locationTileId,
    locationIndex: getRandomItem(options),
  };
};

export const mockGuesses = (groupedItems: GroupedItems, players: GamePlayers, user: GamePlayer) => {
  // TODO: intelligent guessing based on history
  console.log({ userHistory: user.history });

  // if (!user.history) {
  // const randomGroup = getRandomItem(Object.values(groupedItems));
  // const weapons: string[] = randomGroup.filter((e) => e?.includes('wp'));
  // const evidences: string[] = randomGroup.filter((e) => e?.includes('ev'));
  return Object.values(players).reduce((acc: any, player, index) => {
    if (player.id !== user.id) {
      const historyForThisTarget = user.history?.[player.id] ?? [];
      const lastGuess: GuessHistoryEntry = getLastItem(historyForThisTarget);
      console.log(`TARGET: ${player.name}`);

      if (lastGuess) {
        // If correct or locked
        if (lastGuess.status === 'CORRECT' || lastGuess.status === 'LOCKED') {
          console.log('- it was locked or correct');
          acc[player.id] = {
            weaponId: lastGuess.weaponId,
            evidenceId: lastGuess.evidenceId,
          };
          return acc;
        }

        // If half or wrong
        if (lastGuess.status === 'HALF' || lastGuess.status === 'WRONG') {
          console.log('- it was wrong or half', lastGuess.groupIndex);
          const group = groupedItems[lastGuess.groupIndex];
          const weapons: string[] = group.filter((e) => e?.includes('wp'));
          const evidences: string[] = group.filter((e) => e?.includes('ev'));
          acc[player.id] = {
            weaponId: getRandomItem(weapons),
            evidenceId: getRandomItem(evidences),
          };
          return acc;
        }

        // If wrong group
        const previouslyWrongGroups = historyForThisTarget.reduce((t: number[], guess: GuessHistoryEntry) => {
          if (guess.status === 'WRONG_GROUP') {
            t.push(guess.groupIndex);
          }
          return t;
        }, []);
        const availableGroups = [0, 1, 2, 3]
          .filter((i) => !previouslyWrongGroups.includes(i))
          .map((i) => groupedItems[i]);
        const availableGroupsIndex = [0, 1, 2, 3].filter((i) => !previouslyWrongGroups.includes(i));
        const randomGroup = getRandomItem(availableGroups);
        console.log({ previouslyWrongGroups, availableGroupsIndex, randomGroup });
        const weapons: string[] = randomGroup.filter((e) => e?.includes('wp'));
        const evidences: string[] = randomGroup.filter((e) => e?.includes('ev'));
        acc[player.id] = {
          weaponId: getRandomItem(weapons),
          evidenceId: getRandomItem(evidences),
        };
        return acc;
      }

      // If no history exists
      const randomGroup = getRandomItem(Object.values(groupedItems));
      const weapons: string[] = randomGroup.filter((e) => e?.includes('wp'));
      const evidences: string[] = randomGroup.filter((e) => e?.includes('ev'));
      acc[player.id] = {
        weaponId: getRandomItem(weapons),
        evidenceId: getRandomItem(evidences),
      };
    }
    return acc;
  }, {});
};

export const mockSceneMark = () => {
  return getRandomItem([0, 1, 2, 3, 4, 5]);
};
