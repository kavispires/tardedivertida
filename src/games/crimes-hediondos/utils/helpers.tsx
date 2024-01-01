import { orderBy } from 'lodash';
// Types
import type { GuessHistoryEntry, History, ItemsDict } from '../utils/types';
// Utils
import { getLastItem } from 'utils/helpers';

type SplitWeaponsAndEvidence = {
  weapons: CrimesHediondosCard[];
  evidences: CrimesHediondosCard[];
};
export const splitWeaponsAndEvidence = (items: ItemsDict, language: Language): SplitWeaponsAndEvidence => {
  const { weapons, evidences } = Object.values(items).reduce(
    (acc: PlainObject, item) => {
      if (item.type === 'weapon') {
        acc.weapons.push(item);
      } else {
        acc.evidences.push(item);
      }
      return acc;
    },
    {
      weapons: [],
      evidences: [],
    }
  );

  const sortedWeapons = orderBy(weapons, [`name.${language}`], ['asc']);
  const sortedEvidences = orderBy(evidences, [`name.${language}`], ['asc']);

  return {
    weapons: sortedWeapons,
    evidences: sortedEvidences,
  };
};

export const getHistory = (playerHistory: History, activePlayerId: PlayerId) => {
  return playerHistory?.[activePlayerId] ?? [];
};

export const isHistoryLocked = (history: History, activePlayerId: PlayerId): boolean => {
  const lastGuessHistory = getLastItem(getHistory(history, activePlayerId));
  return Boolean(['CORRECT', 'LOCKED'].includes(lastGuessHistory?.status));
};

export const isEntryLocked = (historyEntry: GuessHistoryEntry): boolean => {
  return Boolean(['CORRECT', 'LOCKED'].includes(historyEntry?.status));
};

export const autoSelectCorrectGuesses = (history: History) => {
  const guesses: PlainObject = {};
  Object.entries(history).forEach(([key, historyEntryArray]: any) => {
    const historyEntry: GuessHistoryEntry = getLastItem(historyEntryArray);
    if (['CORRECT', 'LOCKED'].includes(historyEntry.status)) {
      guesses[key] = {
        weaponId: historyEntry.weaponId,
        evidenceId: historyEntry.evidenceId,
        isComplete: true,
      };
    }
  });
  return guesses;
};
