import { getRandomItem, shuffle } from '../../utils/helpers';

export const mockCrime = (itemsGroup: string[]): SubmitCrimePayload => {
  const shuffledItems = shuffle(itemsGroup);
  console.log(shuffledItems);
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

export const mockGuesses = (weapons: HCard[], evidences: HCard[], players: GamePlayers, user: GamePlayer) => {
  const shuffledWeapons = shuffle(weapons);
  const shuffledEvidences = shuffle(evidences);
  return Object.values(players).reduce((acc: any, player, index) => {
    if (player.id !== user.id) {
      acc[player.id] = {
        weaponId: shuffledWeapons[index].id,
        evidenceId: shuffledEvidences[index].id,
        isComplete: true,
      };
    }
    return acc;
  }, {});
};

export const mockSceneMark = () => {
  return getRandomItem([0, 1, 2, 3, 4, 5]);
};
