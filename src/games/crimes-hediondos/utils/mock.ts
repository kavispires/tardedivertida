// Types
import type { GamePlayers, GamePlayer } from "types/player";
import type { CrimeSceneTile } from "types/tdr";
// Utils
import { SEPARATOR } from "utils/constants";
import { getLastItem, getRandomItem, shuffle } from "utils/helpers";
// Internal
import type {
  GroupedItems,
  GuessHistoryEntry,
  SubmitCrimePayload,
} from "../utils/types";

export const mockCrime = (
  itemsGroup: string[],
  locationTiles: CrimeSceneTile[],
): SubmitCrimePayload => {
  const shuffledItems = shuffle(itemsGroup);
  const weapon = shuffledItems.find((e) => e?.includes("wp"));
  const evidence = shuffledItems.find((e) => e?.includes("ev"));
  const options = [0, 1, 2, 3, 4, 5];

  return {
    weaponId: weapon,
    evidenceId: evidence,
    causeOfDeath: getRandomItem(options),
    reasonForEvidence: getRandomItem(options),
    locationTile: getRandomItem(locationTiles).id,
    locationIndex: getRandomItem(options),
  };
};

export const mockGuesses = (
  groupedItems: GroupedItems,
  players: GamePlayers,
  user: GamePlayer,
) => {
  // TODO: intelligent guessing based on history

  return Object.values(players).reduce((acc: any, player) => {
    if (player.id !== user.id) {
      const historyForThisTarget = user.history?.[player.id] ?? [];

      const lastGuess: GuessHistoryEntry = getLastItem(historyForThisTarget);

      if (lastGuess) {
        // If correct or locked
        if (lastGuess.status === "CORRECT" || lastGuess.status === "LOCKED") {
          acc[player.id] = {
            weaponId: lastGuess.weaponId,
            evidenceId: lastGuess.evidenceId,
          };
          return acc;
        }

        // If half or wrong
        if (lastGuess.status === "HALF" || lastGuess.status === "WRONG") {
          const group = groupedItems[lastGuess.groupIndex];
          const weapons: string[] = group.filter((e) => e?.includes("wp"));
          const evidences: string[] = group.filter((e) => e?.includes("ev"));

          const previousPicksDict = historyForThisTarget.reduce(
            (acc: BooleanDictionary, entry: GuessHistoryEntry) => {
              acc[`${entry.weaponId}${SEPARATOR}${entry.evidenceId}`] = true;
              return acc;
            },
            {},
          );
          let pair = `${getRandomItem(weapons)}${SEPARATOR}${getRandomItem(evidences)}`;

          while (previousPicksDict[pair]) {
            pair = `${getRandomItem(weapons)}${SEPARATOR}${getRandomItem(evidences)}`;
          }

          const [weaponId, evidenceId] = pair.split(SEPARATOR);

          acc[player.id] = {
            weaponId,
            evidenceId,
          };
          return acc;
        }

        // If wrong group
        const previouslyWrongGroups = historyForThisTarget.reduce(
          (t: number[], guess: GuessHistoryEntry) => {
            if (guess.status === "WRONG_GROUP") {
              t.push(guess.groupIndex);
            }
            return t;
          },
          [],
        );
        const availableGroups = [0, 1, 2, 3]
          .filter((i) => !previouslyWrongGroups.includes(i))
          .map((i) => groupedItems[i]);
        const randomGroup = getRandomItem(availableGroups);

        const weapons: string[] = randomGroup.filter((e) => e?.includes("wp"));
        const evidences: string[] = randomGroup.filter((e) =>
          e?.includes("ev"),
        );
        acc[player.id] = {
          weaponId: getRandomItem(weapons),
          evidenceId: getRandomItem(evidences),
        };
        return acc;
      }

      // If no history exists
      const randomGroup = getRandomItem(Object.values(groupedItems));
      const weapons: string[] = randomGroup.filter((e) => e?.includes("wp"));
      const evidences: string[] = randomGroup.filter((e) => e?.includes("ev"));
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
