// Constants
import {
  CANDY_VALUES,
  CARD_KEY_PREFIX,
  DECISIONS,
  HORROR_SETS,
  JACKPOT_VALUES,
  MAX_ROUNDS,
  NA_RUA_DO_MEDO_ACHIEVEMENTS,
  NA_RUA_DO_MEDO_PHASES,
  OUTCOME_STATUS,
  SHORT_GAME_ROUNDS,
} from './constants';
// Types
import type {
  CandyStatus,
  Card,
  Decks,
  FirebaseStateData,
  FirebaseStoreData,
  NaRuaDoMedoAchievement,
  Outcome,
} from './types';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  outcome: Outcome,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, TRICK_OR_TREAT, RESULT, STREET_END, GAME_OVER } = NA_RUA_DO_MEDO_PHASES;
  const order = [RULES, SETUP, TRICK_OR_TREAT, RESULT, STREET_END, GAME_OVER];

  if (!outcome) {
    return GAME_OVER;
  }

  if (outcome.status === OUTCOME_STATUS.END_STREET) {
    return STREET_END;
  }

  if (
    currentPhase === STREET_END &&
    (triggerLastRound || (round.current > 0 && round.current) === round.total)
  ) {
    return GAME_OVER;
  }

  if (
    outcome.status === OUTCOME_STATUS.NEW_STREET ||
    (currentPhase === RESULT && outcome.status === OUTCOME_STATUS.CONTINUE)
  ) {
    return TRICK_OR_TREAT;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TRICK_OR_TREAT;
};

export const buildDecks = (isShortGame: number): Decks => {
  // 1. Build horror deck: get one random horror of each set and make 3 copies of it
  const horrorCount = {};
  const horrorDeck: Card[] = utils.helpers.flattenArray(
    HORROR_SETS.map((horrorGroup: DualLanguageValue[]) => {
      const horrorName = utils.game.getRandomItem(horrorGroup);
      const horrorGenericName = horrorName.en.toLowerCase();
      const horrorKey = `${CARD_KEY_PREFIX}-horror-${horrorGenericName}`;
      // This is used to count how many horrors have happen each round
      horrorCount[horrorKey] = 0;

      return new Array(3).fill(1).map((e, i) => ({
        id: `horror-${horrorGenericName}-${e + i}`,
        name: horrorName,
        key: horrorKey,
        type: 'horror',
        value: 0,
      }));
    })
  );

  // 2. Build jackpot deck: based on game length
  const jackpotDeck: Card[] = new Array(isShortGame ? SHORT_GAME_ROUNDS : MAX_ROUNDS)
    .fill('jackpot')
    .map((typeName, i) => ({
      id: `jackpot-${JACKPOT_VALUES[i]}-${i + 1}`,
      key: `${CARD_KEY_PREFIX}-jackpot-${JACKPOT_VALUES[i]}`,
      name: {
        pt: 'iPad',
        en: 'iPad',
      },
      type: typeName,
      value: JACKPOT_VALUES[i],
    }));

  // 3. Build candy deck with all candy
  const candyDeck: Card[] = CANDY_VALUES.map((candyValue, i) => ({
    id: `candy-${candyValue}-${i + 1}`,
    key: `${CARD_KEY_PREFIX}-candy-${candyValue}`,
    name: {
      pt: `Doce ${candyValue}`,
      en: `Candy ${candyValue}`,
    },
    type: 'candy',
    value: candyValue,
  }));

  return {
    horrorDeck,
    jackpotDeck,
    candyDeck,
    horrorCount,
  };
};

export const buildStreetDeck = (store: FirebaseStoreData, currentRound: number): Card[] => {
  // Remove last used horror, if any
  const horrorDeckWithoutAnyUsedHorrors = store.horrorDeck.filter(
    (horror: Card) => !store.usedHorrorIds.includes(horror.id)
  );

  // Add jackpots up to the current level
  const availableJackpots = store.jackpotDeck.filter((jackpot: Card, index: number) => {
    return index < currentRound && !store.claimedJackpotIds.includes(jackpot.id);
  });

  // Add all candy values
  const streetDeck = [...store.candyDeck, ...horrorDeckWithoutAnyUsedHorrors, ...availableJackpots];

  return utils.game.shuffle(streetDeck);
};

export const shareCandy = (players: Players, currentCard?: Card): CandyStatus => {
  if (!currentCard || ['jackpot', 'horror'].includes(currentCard.type)) {
    return {
      leftover: 0,
      perPlayer: 0,
    };
  }

  const continuingPlayers = Object.values(players).filter((player) => player.isTrickOrTreating);
  const playerCount = continuingPlayers.length;
  const perPlayer = Math.floor(currentCard.value / playerCount);
  const leftover = currentCard.value % playerCount;

  continuingPlayers.forEach((player) => {
    player.hand += perPlayer;
  });

  return {
    leftover,
    perPlayer,
  };
};

/**
 * Deal a new card to the current street
 * This function modifies store and players
 * @param store
 * @param players
 */
export const dealNewCard = (
  store: FirebaseStoreData,
  players: Players
): { currentCard: Card; candyStatus: CandyStatus } => {
  // Deal card
  const currentCard = store.streetDeck.pop();

  // Share candy
  const candyStatus = shareCandy(players, currentCard);

  // Add Horror count
  if (currentCard && currentCard.type === 'horror') {
    store.horrorCount[currentCard.key] += 1;
  }

  return {
    currentCard,
    candyStatus,
  };
};

type ParsedDecisions = {
  street: Card[];
  candySidewalk: CandyStatus[];
  claimedJackpotIds: string[];
  goingHomePlayerIds: PlayerId[];
  continuingPlayerIds: PlayerId[];
  alreadyAtHomePlayerIds: PlayerId[];
  cashedInCandy: number;
};

export const parseDecisions = (
  players: Players,
  candySidewalk: CandyStatus[],
  street: Card[],
  store: FirebaseStoreData
): ParsedDecisions => {
  const { claimedJackpotIds } = store;
  const monsterCount = countMonsters(street);

  // Candy to be distributed
  const totalCandy = getTotalCandyInSidewalk(candySidewalk);

  // Gather players who have left
  const continuingPlayers: Player[] = [];
  const goingHomePlayers: Player[] = [];
  const alreadyHomePlayers: Player[] = [];
  const goingHomePlayerIds: PlayerId[] = [];
  const continuingPlayerIds: PlayerId[] = [];
  const alreadyAtHomePlayerIds: PlayerId[] = [];

  Object.values(players).forEach((player) => {
    switch (player.decision) {
      case DECISIONS.HOME:
        alreadyHomePlayers.push(player);
        alreadyAtHomePlayerIds.push(player.id);
        break;
      case DECISIONS.GO_HOME:
        goingHomePlayers.push(player);
        goingHomePlayerIds.push(player.id);
        // Achievement: most houses
        utils.achievements.increaseAchievement(store, player.id, 'houses', 1);
        // Achievement: facing monsters
        utils.achievements.increaseAchievement(store, player.id, 'facingMonsters', monsterCount);
        break;
      case DECISIONS.CONTINUE:
      default:
        continuingPlayers.push(player);
        continuingPlayerIds.push(player.id);
        // Achievement: most houses
        utils.achievements.increaseAchievement(store, player.id, 'houses', 1);
    }
  });

  const goingHomeCount = goingHomePlayers.length;

  // When nobody is going home
  if (goingHomeCount === 0) {
    return {
      street,
      candySidewalk,
      claimedJackpotIds,
      goingHomePlayerIds,
      continuingPlayerIds,
      alreadyAtHomePlayerIds,
      cashedInCandy: 0,
    };
  }

  const candyPerPlayer = Math.floor(totalCandy / goingHomeCount);
  let leftover = goingHomeCount ? totalCandy % goingHomeCount : totalCandy;

  goingHomePlayers.forEach((player) => {
    player.totalCandy += player.hand + candyPerPlayer;
    player.hand = 0;
    player.isTrickOrTreating = false;
    // Achievement: most sidewalk candy
    utils.achievements.increaseAchievement(store, player.id, 'sidewalk', candyPerPlayer);
  });

  let newStreet = street;

  // Handle jackpot
  let newClaimedJackpotIds = claimedJackpotIds;
  const availableJackpot = street.reduce((jackpots: Card[], card: Card): Card[] => {
    if (card.type === 'jackpot') {
      jackpots.push(card);
    }
    return jackpots;
  }, []);

  if (availableJackpot.length > 0 && goingHomeCount === 1) {
    goingHomePlayers[0].currentJackpots = availableJackpot;
    goingHomePlayers[0].jackpots = [...goingHomePlayers[0].jackpots, ...availableJackpot];
    newClaimedJackpotIds = [...claimedJackpotIds, ...availableJackpot.map((card) => card.id)];
    newStreet = street.filter((card) => card.type !== 'jackpot');

    // Achievement: most jackpots
    utils.achievements.increaseAchievement(
      store,
      goingHomePlayers[0].id,
      'jackpots',
      availableJackpot.length
    );
  }

  // Redistribute leftover candy
  const newCandySidewalk = newStreet.map((card) => {
    if (['jackpot', 'horror'].includes(card.type)) {
      return {
        leftover: 0,
        perPlayer: 0,
      };
    } else {
      if (leftover >= card.value) {
        leftover -= card.value;
        return {
          leftover: card.value,
          perPlayer: 0,
        };
      }

      if (leftover > 0) {
        const leftoverCopy = leftover;
        leftover = 0;
        return {
          leftover: leftoverCopy,
          perPlayer: 0,
        };
      }

      return {
        leftover,
        perPlayer: 0,
      };
    }
  });

  return {
    street: newStreet,
    candySidewalk: newCandySidewalk,
    claimedJackpotIds: newClaimedJackpotIds,
    goingHomePlayerIds,
    continuingPlayerIds,
    alreadyAtHomePlayerIds,
    cashedInCandy: candyPerPlayer,
  };
};

export const checkIfIsPanic = (horrorCount: NumberDictionary, newHorrorKey: string) => {
  return horrorCount[newHorrorKey] === 1;
};

export const determineOutcome = (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Outcome => {
  if (state.phase === NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT) {
    return {
      status: OUTCOME_STATUS.CONTINUE,
      flipCard: false,
    };
  }

  if (state.phase === NA_RUA_DO_MEDO_PHASES.STREET_END || state.phase === NA_RUA_DO_MEDO_PHASES.SETUP) {
    return {
      status: OUTCOME_STATUS.NEW_STREET,
      flipCard: true,
    };
  }

  if (state.phase === NA_RUA_DO_MEDO_PHASES.RESULT) {
    // if everybody is home or going home => end of street
    const isEverybodyHome = Object.values(players).every((player) => !player.isTrickOrTreating);
    if (isEverybodyHome) {
      return {
        status: OUTCOME_STATUS.END_STREET,
        isEverybodyHome: true,
        flipCard: false,
      };
    }

    // Peak at next card and decide if it should bit ToT or StreetEnd
    // Deal card
    const nextCard = store.streetDeck[store.streetDeck.length - 1];

    if (nextCard && nextCard.type === 'horror') {
      if (checkIfIsPanic(store.horrorCount, nextCard.key)) {
        return {
          status: OUTCOME_STATUS.END_STREET,
          isEverybodyHome: false,
          flipCard: true,
        };
      }
    }

    return {
      status: OUTCOME_STATUS.CONTINUE,
      flipCard: true,
    };
  }

  return {
    status: OUTCOME_STATUS.CONTINUE,
    flipCard: false,
  };
};

export const sendPlayersHome = (players: Players): PlayerId[] => {
  const atHome: PlayerId[] = [];
  Object.values(players).forEach((player) => {
    if (player.decision === DECISIONS.HOME) {
      atHome.push(player.id);
    }

    if (player.decision === DECISIONS.GO_HOME) {
      player.decision = DECISIONS.HOME;
      player.currentJackpots = null;
      atHome.push(player.id);
    }
  });

  return atHome;
};

export const getTotalCandyInSidewalk = (candySidewalk: CandyStatus[]): number => {
  return candySidewalk.reduce((total, candyObj): number => (total += candyObj.leftover), 0);
};

export const resetHorrorCount = (horrorCount: NumberDictionary): NumberDictionary => {
  Object.keys(horrorCount).forEach((key) => {
    horrorCount[key] = 0;
  });
  return horrorCount;
};

export const tallyCandyAsScore = (players: Players) => {
  Object.values(players).forEach((player) => {
    const jackpots = player.jackpots.reduce((t: number, j: Card) => t + j.value, 0);
    player.score = player.totalCandy + jackpots;
  });
};

export const countMonsters = (street: Card[]) =>
  street.reduce((acc: number, entry) => {
    if (entry.type === 'horror') acc += 1;
    return acc;
  }, 0);

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<NaRuaDoMedoAchievement>[] = [];

  // Bravest: faced the most number of monsters
  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'facingMonsters');
  if (most) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.BRAVEST,
      playerId: most.playerId,
      value: most.facingMonsters,
    });
  }

  // Luckiest: faced the least number of monsters
  if (least) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.LUCKIEST,
      playerId: least.playerId,
      value: least.facingMonsters,
    });
  }

  // Candy Loser: lost the most candy during a scare
  const { most: candyLoser } = utils.achievements.getMostAndLeastOf(store, 'lostCandy');
  if (candyLoser) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.CANDY_LOSER,
      playerId: candyLoser.playerId,
      value: candyLoser.lostCandy,
    });
  }

  // Most houses: visited the most houses
  const { most: mostHouses, least: fewestHouses } = utils.achievements.getMostAndLeastOf(store, 'houses');
  if (mostHouses) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.MOST_HOUSES,
      playerId: mostHouses.playerId,
      value: mostHouses.houses,
    });
  }

  // Most scared: visited the fewest houses
  if (fewestHouses) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.MOST_SCARED,
      playerId: fewestHouses.playerId,
      value: fewestHouses.houses,
    });
  }

  //
  const { most: mostJackpots } = utils.achievements.getMostAndLeastOf(store, 'jackpots');
  if (mostJackpots) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.MOST_JACKPOTS,
      playerId: mostJackpots.playerId,
      value: mostJackpots.jackpots,
    });
  }

  //
  const { most: mostSidewalk } = utils.achievements.getMostAndLeastOf(store, 'sidewalk');
  if (mostSidewalk) {
    achievements.push({
      type: NA_RUA_DO_MEDO_ACHIEVEMENTS.MOST_SIDEWALK,
      playerId: mostSidewalk.playerId,
      value: mostSidewalk.sidewalk,
    });
  }

  return achievements;
};
