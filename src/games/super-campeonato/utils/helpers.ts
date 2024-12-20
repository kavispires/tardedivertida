import { orderBy } from "lodash";
// Internal
import type {
  Bet,
  Bracket,
  BracketTier,
  ContenderByTier,
  FightingContender,
} from "./type";

/**
 * Finds the contender for each of the players bets and selected contender
 * @param brackets
 * @param bets
 * @param selectedContenderId
 * @returns
 */
export const findBetContenders = (
  brackets: Bracket[],
  bets: Bet,
  selectedContenderId: CardId,
) => {
  return {
    quarterCard: brackets.find((bracket) => bracket.id === bets?.quarter),
    semiCard: brackets.find((bracket) => bracket.id === bets?.semi),
    finalCard: brackets.find((bracket) => bracket.id === bets?.final),
    selectedCard: brackets.find(
      (bracket) => bracket.id === selectedContenderId,
    ),
  };
};

/**
 * Get contender ids dictionary for each tier
 * @param brackets
 * @returns
 */
export const getContenderIdsByTier = (brackets: Bracket[]) =>
  brackets.reduce((acc: ContenderByTier, bracket) => {
    if (acc[bracket.tier] === undefined) {
      acc[bracket.tier] = {};
    }
    acc[bracket.tier][bracket.id] = true;
    return acc;
  }, {});

/**
 * Selects the available contenders based on which contenders were already used
 * @param brackets
 * @param tier
 * @param bets
 * @param language
 * @returns list of contenders
 */
export const getSmartBetContenderOptions = (
  brackets: Bracket[],
  tier: BracketTier,
  bets: Bet,
  language: Language,
): FightingContender[] => {
  const allContenders = orderBy(
    brackets.filter((entry) => entry.tier === "quarter"),
    `name.${language}`,
  );

  // For semi: Eliminate any contender in the same side (top or bottom) of the selected winner
  if (tier === "semi" && bets.final) {
    const finalContender = allContenders.find(
      (entry) => entry.id === bets.final,
    );

    if (!finalContender) return allContenders;

    return allContenders.filter((entry) => {
      if (finalContender.position > 3) {
        return entry.position <= 3;
      }
      return entry.position > 3;
    });
  }

  // For quarter: eliminate any contender that would go against semi and final
  if (tier === "quarter" && bets.final && bets.semi) {
    const finalContender = allContenders.find(
      (entry) => entry.id === bets.final,
    );
    if (!finalContender) return allContenders;

    const semiContender = allContenders.find((entry) => entry.id === bets.semi);
    if (!semiContender) return allContenders;

    const opposingFinalContenderPosition =
      finalContender.position % 2 === 0
        ? finalContender.position + 1
        : finalContender.position - 1;

    const opposingSemiContenderPosition =
      semiContender.position % 2 === 0
        ? semiContender.position + 1
        : semiContender.position - 1;

    const forbiddenPositions = [
      finalContender.position,
      opposingFinalContenderPosition,
      semiContender.position,
      opposingSemiContenderPosition,
    ];

    return allContenders.filter((entry) => {
      return !forbiddenPositions.includes(entry.position);
    });
  }

  return allContenders;
};
