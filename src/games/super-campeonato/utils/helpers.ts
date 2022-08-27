/**
 * Finds the contender for each of the players bets and selected contender
 * @param brackets
 * @param bets
 * @param selectedContenderId
 * @returns
 */
export const findBetContenders = (brackets: WBracket[], bets: WBets, selectedContenderId: CardId) => {
  return {
    quarterCard: brackets.find((bracket) => bracket.id === bets.quarter),
    semiCard: brackets.find((bracket) => bracket.id === bets.semi),
    finalCard: brackets.find((bracket) => bracket.id === bets.final),
    selectedCard: brackets.find((bracket) => bracket.id === selectedContenderId),
  };
};

export const parsedBrackets = (brackets: WBracket[]) =>
  brackets.reduce((acc: Record<string, WBracketTier[]>, bracket) => {
    if (acc[bracket.id] === undefined) {
      acc[bracket.id] = [];
    }
    acc[bracket.id].push(bracket.tier);
    return acc;
  }, {});

export const getContenderIdsByTier = (brackets: WBracket[]) =>
  brackets.reduce((acc: WContenderByTier, bracket) => {
    if (acc[bracket.tier] === undefined) {
      acc[bracket.tier] = {};
    }
    acc[bracket.tier][bracket.id] = true;
    return acc;
  }, {});
