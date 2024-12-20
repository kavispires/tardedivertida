import { sampleSize } from "lodash";
// Types
import type { TextCard } from "types/tdr";
// Utils
import { getRandomItem, shuffle } from "utils/helpers";
// Internal
import type { CloverObject, Guesses, Leaves } from "./types";
import { ROTATIONS, WORST_TO_REMOVE } from "./constants";
import { getWord } from "./helpers";

export const mockSelectCards = (cards: TextCard[]): CardId[] =>
  shuffle(cards)
    .slice(0, WORST_TO_REMOVE)
    .map((card) => card.id);

const glue2Words = (word1: string, word2: string) => {
  return `${word1.substring(0, Math.round(word1.length / 2))}${word2.substring(
    Math.round(word2.length / 2),
  )}`;
};

export const mockClues = (
  clover: CloverObject,
  leaves: Leaves,
  rotations: NumberDictionary,
): string[] => {
  return [
    glue2Words(
      getWord(clover, leaves, rotations, "A", "top"),
      getWord(clover, leaves, rotations, "B", "top"),
    ),
    glue2Words(
      getWord(clover, leaves, rotations, "B", "right"),
      getWord(clover, leaves, rotations, "C", "right"),
    ),
    glue2Words(
      getWord(clover, leaves, rotations, "C", "bottom"),
      getWord(clover, leaves, rotations, "D", "bottom"),
    ),
    glue2Words(
      getWord(clover, leaves, rotations, "D", "left"),
      getWord(clover, leaves, rotations, "A", "left"),
    ),
  ];
};

const mockedScore = [3, 1, 1, 1, 0, 0];

export const mockGuesses = (leaves: Leaves): Guesses => {
  const selected = sampleSize(Object.keys(leaves), 4);

  return {
    A: {
      leafId: selected[0],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    B: {
      leafId: selected[1],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    C: {
      leafId: selected[2],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    D: {
      leafId: selected[3],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
  };
};
