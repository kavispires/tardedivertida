// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { getRandomItem, shuffle } from 'utils/helpers';
// Internal
import type { GroupedItems, Guess, SubmitCrimePayload } from '../utils/types';
import { GUESS_STATUS } from './constants';
import { getItemType } from './helpers';

export const mockCrime = (itemsGroup: string[]): SubmitCrimePayload => {
  const shuffledItems = shuffle(itemsGroup);
  const weapon = shuffledItems.find((e) => e?.includes('wp'));
  const evidence = shuffledItems.find((e) => e?.includes('ev'));
  const location = shuffledItems.find((e) => e?.includes('lc'));
  const victim = shuffledItems.find((e) => e?.includes('vt'));
  const options = [0, 1, 2, 3, 4, 5];

  return {
    weaponId: weapon,
    evidenceId: evidence,
    victimId: victim ?? '',
    locationId: location ?? '',
    causeOfDeathIndex: getRandomItem(options),
    reasonForEvidenceIndex: getRandomItem(options),
    locationIndex: getRandomItem(options),
    victimIndex: getRandomItem(options),
  };
};

export const mockSceneMark = () => {
  return getRandomItem([0, 1, 2, 3, 4, 5]);
};

export const mockGuesses = (
  groupedItems: GroupedItems,
  players: GamePlayers,
  user: GamePlayer,
  isVictimGame: boolean,
  isLocationGame: boolean,
): Record<PlayerId, Guess> => {
  return Object.values(players).reduce((acc: Record<PlayerId, Guess>, player) => {
    if (player.id !== user.id) {
      const history = user.history?.[player.id] ?? [];
      const triedGroups = new Set<number>();
      const bannedGroups = new Set<number>();
      const knownWrongItems = new Set<string>();
      const confirmedGroupItems = new Set<string>();

      let lastGroupIndex: number | null = null;

      for (const entry of history) {
        triedGroups.add(entry.groupIndex);

        switch (entry.status) {
          case GUESS_STATUS.WRONG_GROUP:
            bannedGroups.add(entry.groupIndex);
            break;
          case GUESS_STATUS.WRONG:
            if (entry.weaponId) knownWrongItems.add(entry.weaponId);
            if (entry.evidenceId) knownWrongItems.add(entry.evidenceId);
            if (entry.victimId) knownWrongItems.add(entry.victimId);
            if (entry.locationId) knownWrongItems.add(entry.locationId);
            lastGroupIndex = entry.groupIndex;
            break;
          case GUESS_STATUS.ONE:
          case GUESS_STATUS.TWO:
          case GUESS_STATUS.THREE:
            lastGroupIndex = entry.groupIndex;
            if (entry.weaponId) confirmedGroupItems.add(entry.weaponId);
            if (entry.evidenceId) confirmedGroupItems.add(entry.evidenceId);
            if (entry.victimId) confirmedGroupItems.add(entry.victimId);
            if (entry.locationId) confirmedGroupItems.add(entry.locationId);
            break;
          case GUESS_STATUS.CORRECT:
          case GUESS_STATUS.LOCKED:
            acc[player.id] = {
              weaponId: entry.weaponId,
              evidenceId: entry.evidenceId,
            };
            if (isVictimGame) acc[player.id].victimId = entry.victimId;
            if (isLocationGame) acc[player.id].locationId = entry.locationId;
            return acc;
        }
      }

      let groupIndexToTry = lastGroupIndex;

      if (groupIndexToTry === null) {
        groupIndexToTry =
          Object.keys(groupedItems)
            .map(Number)
            .find((groupIndex) => !bannedGroups.has(groupIndex)) ?? -1;
      }

      const candidates = groupedItems[groupIndexToTry] || [];
      const available = candidates.filter((id) => !knownWrongItems.has(id));

      // Categorize by type
      const itemsByType: Record<string, string[]> = {
        weapon: [],
        evidence: [],
        victim: [],
        location: [],
      };

      for (const id of available) {
        const type = getItemType(id);
        itemsByType[type].push(id);
      }

      // Try all valid combinations that haven’t been tried yet
      for (const weaponId of itemsByType.weapon) {
        for (const evidenceId of itemsByType.evidence) {
          if (!isVictimGame) {
            for (const locationId of isLocationGame ? itemsByType.location : ['']) {
              const alreadyTried = history.some(
                (h: { weaponId: string; evidenceId: string; locationId: string }) =>
                  h.weaponId === weaponId &&
                  h.evidenceId === evidenceId &&
                  (!isLocationGame || h.locationId === locationId),
              );
              if (!alreadyTried) {
                acc[player.id] = {
                  weaponId,
                  evidenceId,
                  locationId: isLocationGame ? locationId : undefined,
                };
                return acc;
              }
            }
          } else {
            for (const victimId of itemsByType.victim) {
              for (const locationId of isLocationGame ? itemsByType.location : ['']) {
                const alreadyTried = history.some(
                  (h: { weaponId: string; evidenceId: string; victimId: string; locationId: string }) =>
                    h.weaponId === weaponId &&
                    h.evidenceId === evidenceId &&
                    h.victimId === victimId &&
                    (!isLocationGame || h.locationId === locationId),
                );
                if (!alreadyTried) {
                  acc[player.id] = {
                    weaponId,
                    evidenceId,
                    victimId,
                    locationId: isLocationGame ? locationId : undefined,
                  };
                  return acc;
                }
              }
            }
          }
        }
      }
    }

    return acc;
  }, {});
};
