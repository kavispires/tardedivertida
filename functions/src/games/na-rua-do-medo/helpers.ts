import { sampleSize, shuffle } from 'lodash';
// Types
import type { CandyStatus, HouseCard, Decks, FirebaseStateData, FirebaseStoreData, Outcome } from './types';
// Constants
import {
  CANDY_VALUES,
  CARD_KEY_PREFIX,
  DECISIONS,
  HORROR_SETS,
  JACKPOT_VALUES,
  MAX_ROUNDS,
  NA_RUA_DO_MEDO_PHASES,
  OUTCOME_STATUS,
  SHORT_GAME_ROUNDS,
} from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the round
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: Outcome): string => {
  const { SETUP, TRICK_OR_TREAT, RESULT, STREET_END, GAME_OVER } = NA_RUA_DO_MEDO_PHASES;
  const order = [SETUP, TRICK_OR_TREAT, RESULT, STREET_END, GAME_OVER];

  if (!outcome) {
    return GAME_OVER;
  }

  if (outcome.status === OUTCOME_STATUS.END_STREET) {
    return STREET_END;
  }

  if (
    currentPhase === STREET_END &&
    (round.forceLastRound || (round.current > 0 && round.current) === round.total)
  ) {
    return GAME_OVER;
  }

  if (
    outcome.status === OUTCOME_STATUS.NEW_STREET ||
    (currentPhase === RESULT && outcome.status === OUTCOME_STATUS.CONTINUE)
  ) {
    return TRICK_OR_TREAT;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Creates horror, candy, and jackpot decks and initializes horror counters for the selected game length.
 * @param isShortGame - Whether to build decks for the shorter game
 * @returns The card decks and horror counters
 */
export const buildDecks = (isShortGame: boolean): Decks => {
  // 1. Build horror deck: get one random horror of each set and make 3 copies of it
  const horrorCount = {};
  const horrorDeck: HouseCard[] = HORROR_SETS.flatMap((horrorGroup: DualLanguageValue[]) => {
    const horrorName = sampleSize(horrorGroup, 1)[0];
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
  });

  // 2. Build jackpot deck: based on game length
  const jackpotDeck: HouseCard[] = new Array(isShortGame ? SHORT_GAME_ROUNDS : MAX_ROUNDS)
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
  const candyDeck: HouseCard[] = CANDY_VALUES.map((candyValue, i) => ({
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

/**
 * Shuffles available candy, unused horrors, and unlocked jackpots, rotating special cards away from the next draw when possible.
 * @param store - The server-side game data used for this step
 * @param currentRound - The current round number
 * @returns The street deck for this round
 */
export const buildStreetDeck = (store: FirebaseStoreData, currentRound: number): HouseCard[] => {
  // Remove last used horror, if any
  const horrorDeckWithoutAnyUsedHorrors = store.horrorDeck.filter(
    (horror: HouseCard) => !store.usedHorrorIds.includes(horror.id),
  );

  // Add jackpots up to the current level
  const availableJackpots = store.jackpotDeck.filter((jackpot: HouseCard, index: number) => {
    return index < currentRound && !store.claimedJackpotIds.includes(jackpot.id);
  });

  // Add all candy values
  const streetDeck = [...store.candyDeck, ...horrorDeckWithoutAnyUsedHorrors, ...availableJackpots];

  const shuffledStreet = shuffle(streetDeck);

  let tries = 0;
  while (
    tries < 20 &&
    shuffledStreet.length > 0 &&
    ['jackpot', 'horror'].includes(shuffledStreet[shuffledStreet.length - 1].type)
  ) {
    shuffledStreet.unshift(shuffledStreet.pop() as HouseCard);
    tries++;
  }

  return shuffledStreet;
};

/**
 * Distributes a candy card evenly into continuing players' hands, leaving any remainder on the sidewalk.
 * @param players - The players participating in this game step
 * @param currentCard - The card being resolved, when one has been revealed
 * @returns The per-player share and leftover candy
 */
export const shareCandy = (players: Players, currentCard?: HouseCard): CandyStatus => {
  if (!currentCard || ['jackpot', 'horror'].includes(currentCard.type)) {
    return {
      leftover: 0,
      perPlayer: 0,
    };
  }

  const continuingPlayers = getListOfPlayers(players).filter((player) => player.isTrickOrTreating);
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
 * @param store - The server-side game data used for this step
 * @param players - The players participating in this game step
 */
export const dealNewCard = (
  store: FirebaseStoreData,
  players: Players,
): {
  /**
   * The card most recently revealed on the street.
   */
  currentCard: HouseCard;
  /**
   * The distribution of candy from the newly revealed card.
   */
  candyStatus: CandyStatus;
} => {
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

/**
 * The street and player groups after resolving departures, candy, and jackpot claims.
 */
type ParsedDecisions = {
  /**
   * Cards revealed along the current street.
   */
  street: HouseCard[];
  /**
   * Per-card candy shares and unclaimed candy left on the street.
   */
  candySidewalk: CandyStatus[];
  /**
   * Identifiers of jackpots already claimed by players.
   */
  claimedJackpotIds: string[];
  /**
   * Identifiers of players returning home on this step.
   */
  goingHomePlayerIds: UID[];
  /**
   * Identifiers of players continuing to the next house.
   */
  continuingPlayerIds: UID[];
  /**
   * Identifiers of players who were already home before this step.
   */
  alreadyAtHomePlayerIds: UID[];
  /**
   * Sidewalk candy banked by each player returning home.
   */
  cashedInCandy: number;
};

/**
 * Resolves player departures, banks their candy, awards unclaimed jackpots to a sole returnee, and redistributes leftovers.
 * @param players - The players participating in this game step
 * @param candySidewalk - Candy shares and leftovers associated with the street cards
 * @param street - The cards revealed on the current street
 * @param store - The server-side game data used for this step
 * @returns The updated street, candy distribution, and player groups
 */
export const parseDecisions = (
  players: Players,
  candySidewalk: CandyStatus[],
  street: HouseCard[],
  store: FirebaseStoreData,
): ParsedDecisions => {
  const { claimedJackpotIds } = store;
  const monsterCount = countMonsters(street);

  // Candy to be distributed
  const totalCandy = getTotalCandyInSidewalk(candySidewalk);

  // Gather players who have left
  const continuingPlayers: Player[] = [];
  const goingHomePlayers: Player[] = [];
  const alreadyHomePlayers: Player[] = [];
  const goingHomePlayerIds: UID[] = [];
  const continuingPlayerIds: UID[] = [];
  const alreadyAtHomePlayerIds: UID[] = [];

  getListOfPlayers(players).forEach((player) => {
    switch (player.decision) {
      case DECISIONS.HOME:
        alreadyHomePlayers.push(player);
        alreadyAtHomePlayerIds.push(player.id);
        break;
      case DECISIONS.GO_HOME:
        goingHomePlayers.push(player);
        goingHomePlayerIds.push(player.id);
        // Achievement: most houses
        increaseAchievement(store.achievements, player.id, 'houses', 1);
        // Achievement: facing monsters
        increaseAchievement(store.achievements, player.id, 'facingMonsters', monsterCount);
        break;
      // case DECISIONS.CONTINUE:
      default:
        continuingPlayers.push(player);
        continuingPlayerIds.push(player.id);
        // Achievement: most houses
        increaseAchievement(store.achievements, player.id, 'houses', 1);
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
    increaseAchievement(store.achievements, player.id, 'sidewalk', candyPerPlayer);
  });

  let newStreet = street;

  // Handle jackpot
  let newClaimedJackpotIds = claimedJackpotIds;
  const availableJackpot = street.reduce((jackpots: HouseCard[], card: HouseCard): HouseCard[] => {
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
    increaseAchievement(store.achievements, goingHomePlayers[0].id, 'jackpots', availableJackpot.length);
  }

  // Redistribute leftover candy
  const newCandySidewalk = newStreet.map((card) => {
    if (['jackpot', 'horror'].includes(card.type)) {
      return {
        leftover: 0,
        perPlayer: 0,
      };
    }
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

/**
 * Checks whether revealing another copy of a horror would repeat an already revealed horror.
 * @param horrorCount - The occurrence count for each horror key
 * @param newHorrorKey - The horror key that would be revealed next
 * @returns Whether the horror has already appeared once
 */
export const checkIfIsPanic = (horrorCount: Dictionary<number>, newHorrorKey: string) => {
  return horrorCount[newHorrorKey] === 1;
};

/**
 * Determines whether to continue, start a street, or end the current street based on phase, players, and the next card.
 * @param store - The server-side game data used for this step
 * @param state - The current game state
 * @param players - The players participating in this game step
 * @returns The street outcome and whether another card should be revealed
 */
export const determineOutcome = (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
    const isEverybodyHome = getListOfPlayers(players).every((player) => !player.isTrickOrTreating);
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

/**
 * Marks returning players as home and clears their current jackpot display.
 * @param players - The players participating in this game step
 * @returns The identifiers of players who are now home
 */
export const sendPlayersHome = (players: Players): UID[] => {
  const atHome: UID[] = [];
  getListOfPlayers(players).forEach((player) => {
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

/**
 * Sums the unclaimed candy left on the sidewalk.
 * @param candySidewalk - Candy shares and leftovers associated with the street cards
 * @returns The total leftover candy
 */
export const getTotalCandyInSidewalk = (candySidewalk: CandyStatus[]): number => {
  return candySidewalk.reduce((total, candyObj): number => {
    return total + candyObj.leftover;
  }, 0);
};

/**
 * Resets all horror occurrence counters in place.
 * @param horrorCount - The occurrence count for each horror key
 * @returns The reset counter dictionary
 */
export const resetHorrorCount = (horrorCount: Dictionary<number>): Dictionary<number> => {
  Object.keys(horrorCount).forEach((key) => {
    horrorCount[key] = 0;
  });
  return horrorCount;
};

/**
 * Updates each player's score from banked candy and collected jackpot values.
 * @param players - The players participating in this game step
 */
export const tallyCandyAsScore = (players: Players) => {
  getListOfPlayers(players).forEach((player) => {
    const jackpots = player.jackpots.reduce((t: number, j: HouseCard) => t + j.value, 0);
    player.score = player.totalCandy + jackpots;
  });
};

/**
 * Counts the horror cards revealed on a street.
 * @param street - The cards revealed on the current street
 * @returns The number of revealed horror cards
 */
export const countMonsters = (street: HouseCard[]) => {
  return street.reduce((acc: number, entry) => {
    if (entry.type === 'horror') {
      return acc + 1;
    }
    return acc;
  }, 0);
};
