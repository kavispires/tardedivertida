// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Internal
import type { RunnerCard } from './types';

export function mockCardPlay(
  user: GamePlayer,
  players: GamePlayers,
  cardsDict: Dictionary<RunnerCard>,
): { targetId: string; cardId: string } {
  const userPosition = user.positions.at(-1) ?? 0;
  const hand: string[] = user.hand;
  const positiveMovement = hand.filter((cardId) => cardsDict[cardId].type === 'movement-positive');
  const negativeMovement = hand.filter((cardId) => cardsDict[cardId].type === 'movement-negative');
  const neutralMovement = hand.filter((cardId) => cardsDict[cardId].type === 'movement-neutral');
  const effects = hand.filter((cardId) => !cardsDict[cardId].type.startsWith('movement-'));

  const sortedPlayers = Object.values(players)
    .map((player) => ({
      ...player,
      position: player.positions.at(-1) ?? 0,
    }))
    .sort((a, b) => b.position - a.position); // descending: first is 1st place

  // Group players by position
  const positionGroups: string[][] = [];
  const seenPositions = new Set<number>();

  for (const player of sortedPlayers) {
    if (!seenPositions.has(player.position)) {
      const group = sortedPlayers.filter((p) => p.position === player.position).map((p) => p.id);
      positionGroups.push(group);
      seenPositions.add(player.position);
    }
  }

  const userRank = positionGroups.findIndex((group) => group.includes(user.id));
  const userIsInSecond = userRank === 1;
  const userIsFirst = userRank === 0;
  const userIsThirdOrLower = userRank >= 2;

  // Helper to get a card with highest movement value
  const getCardWithMaxValue = (cards: string[], positive = true) =>
    cards
      .map((id) => cardsDict[id])
      .sort((a, b) => {
        const aVal = a.value ?? 0;
        const bVal = b.value ?? 0;
        return positive ? bVal - aVal : aVal - bVal;
      })[0];

  if (!userIsInSecond) {
    if (effects.length > 0 && Math.random() < 0.4) {
      console.log('I like chaos, playing an effect card');
      return {
        targetId: user.id,
        cardId: effects[0],
      };
    }
  }

  if (userIsInSecond) {
    const firstGroup = positionGroups[0];
    const thirdGroup = positionGroups[2];
    const firstPlayer = sortedPlayers.find((p) => firstGroup.includes(p.id));
    const thirdPlayer = thirdGroup && sortedPlayers.find((p) => thirdGroup.includes(p.id));

    if (positiveMovement.length > 0 && firstPlayer) {
      const bestCard = getCardWithMaxValue(positiveMovement, true);
      console.log('I am in second place, playing a positive card');
      return {
        targetId: firstPlayer.id,
        cardId: bestCard.id,
      };
    }
    if (negativeMovement.length > 0 && thirdPlayer) {
      const bestCard = getCardWithMaxValue(negativeMovement, false);
      console.log('I am in second place, playing a negative card');
      return {
        targetId: thirdPlayer.id,
        cardId: bestCard.id,
      };
    }
  }

  if (userIsFirst) {
    if (negativeMovement.length > 0) {
      const worstCard = getCardWithMaxValue(negativeMovement, false);
      console.log('I am in first place, playing a negative card');
      return {
        targetId: user.id,
        cardId: worstCard.id,
      };
    }
  }

  if (userIsThirdOrLower) {
    if (positiveMovement.length > 0) {
      const bestCard = getCardWithMaxValue(positiveMovement, true);
      console.log('I am in third or lower place, playing a positive card');
      return {
        targetId: user.id,
        cardId: bestCard.id,
      };
    }
    if (negativeMovement.length > 0) {
      const aheadGroup = positionGroups.find((group) => !group.includes(user.id));
      const aheadPlayer = sortedPlayers.find((p) => aheadGroup?.includes(p.id));
      const bestCard = getCardWithMaxValue(negativeMovement, false);
      console.log('I am in third or lower place, playing a negative card');
      return {
        targetId: aheadPlayer?.id ?? user.id,
        cardId: bestCard.id,
      };
    }
  }

  // Fallback
  console.log('No specific condition met, playing a random card');
  return {
    targetId: user.id,
    cardId: hand[0],
  };
}
