// Constants
import {
  CRIMES_HEDIONDOS_ACHIEVEMENTS,
  CRIMES_HEDIONDOS_PHASES,
  GUESS_STATUS,
  ITEMS_GROUP_COUNT,
  ITEMS_PER_GROUP,
  SCENE_TILES_COUNT,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type {
  Crime,
  CrimesHediondosAchievement,
  FirebaseStoreData,
  GroupedItems,
  Guess,
  Guesses,
  GuessHistory,
  GuessHistoryEntry,
  WrongGroups,
  WrongItems,
} from './types';
import type { CrimeSceneTile, CrimesHediondosCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
import { orderBy } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER } =
    CRIMES_HEDIONDOS_PHASES;
  const order = [LOBBY, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : SCENE_MARKING;
  }

  if (currentPhase === CRIME_SELECTION) {
    return GUESSING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return SCENE_MARKING;
};

type ParsedTiles = {
  causeOfDeathTile?: CrimeSceneTile;
  reasonForEvidenceTile?: CrimeSceneTile;
  locationTile?: CrimeSceneTile;
  victimTile?: CrimeSceneTile;
  victimsTiles: CrimeSceneTile[];
  sceneTiles: CrimeSceneTile[];
};

export const parseTiles = (sceneTiles: CrimeSceneTile[]): ParsedTiles => {
  const result = sceneTiles.reduce(
    (acc: ParsedTiles, tile: CrimeSceneTile) => {
      if (tile.type === 'cause') {
        acc.causeOfDeathTile = tile;
      } else if (tile.type === 'evidence') {
        acc.reasonForEvidenceTile = tile;
      } else if (tile.type === 'location') {
        acc.locationTile = tile;
      } else if (tile.specific === 'victim') {
        acc.victimsTiles.push(tile);
      } else {
        acc.sceneTiles.push(tile);
      }

      return acc;
    },
    {
      sceneTiles: [],
      victimsTiles: [],
    },
  );

  result.victimTile = utils.game.getRandomItem(result.victimsTiles);
  result.victimTile.type = 'victim';

  const leftoverVictimTiles = result.victimsTiles.filter((tile) => tile.id !== result.victimTile?.id);

  result.sceneTiles = utils.game.getRandomItems(
    [...result.sceneTiles, ...leftoverVictimTiles],
    SCENE_TILES_COUNT,
  );

  return result;
};

export const cleanupItemsLikelihood = (
  weapons: CrimesHediondosCard[],
  evidence: CrimesHediondosCard[],
  victims: CrimesHediondosCard[],
  locations: CrimesHediondosCard[],
  scenesIds: string[],
) => {
  const allItems = [...weapons, ...evidence, ...victims, ...locations];
  allItems.forEach((item) => {
    if (item.likelihood) {
      const newLikelihood: Record<string, number[]> = {};
      scenesIds.forEach((sceneId) => {
        if (item.likelihood?.[sceneId]) {
          newLikelihood[sceneId] = item.likelihood[sceneId];
        }
      });
      item.likelihood = newLikelihood;
    }
  });
};

type GroupItems = {
  items: Dictionary<CrimesHediondosCard>;
  groupedItems: GroupedItems;
};

export const groupItems = (
  weapons: CrimesHediondosCard[],
  evidence: CrimesHediondosCard[],
  victims: CrimesHediondosCard[],
  locations: CrimesHediondosCard[],
): GroupItems => {
  // Divide things into 4 groups
  const groupedWeapons = utils.game.sliceIntoChunks(weapons, ITEMS_PER_GROUP);
  const groupedEvidence = utils.game.sliceIntoChunks(evidence, ITEMS_PER_GROUP);
  const groupedLocations = utils.game.sliceIntoChunks(locations, ITEMS_PER_GROUP);
  const groupedVictims = utils.game.sliceIntoChunks(victims, ITEMS_PER_GROUP);

  const groupedItems = {};
  groupedEvidence.forEach((evidenceGroup, index) => {
    groupedItems[`${index}`] = [
      ...groupedWeapons[index].map((i) => i.id),
      ...evidenceGroup.map((i) => i.id),
      ...(groupedVictims[index] ? groupedVictims[index].map((i) => i.id) : []),
      ...(groupedLocations[index] ? groupedLocations[index].map((i) => i.id) : []),
    ];
  });

  const itemsDict = [...weapons, ...evidence, ...victims, ...locations].reduce(
    (acc: PlainObject, item: CrimesHediondosCard) => {
      acc[item.id] = item;
      return acc;
    },
    {},
  );

  return {
    items: itemsDict,
    groupedItems,
  };
};

export const dealItemGroups = (players: Players) => {
  utils.players.getListOfPlayersIds(players, true).forEach((playerId) => {
    players[playerId].itemGroupIndex = Math.round(Math.random() * 100) % ITEMS_GROUP_COUNT;
  });
};

export const buildCrimes = (
  players: Players,
  causeOfDeathTile: CrimeSceneTile,
  reasonForEvidenceTile: CrimeSceneTile,
  locationTile: CrimeSceneTile,
  victimTile: CrimeSceneTile,
): Crime[] => {
  return utils.players.getListOfPlayers(players, true).map((player) => {
    return {
      playerId: player.id,
      weaponId: player.weaponId,
      evidenceId: player.evidenceId,
      victimId: player.victimId ?? '',
      locationId: player.locationId ?? '',
      scenes: {
        [causeOfDeathTile.id]: player.causeOfDeathIndex,
        [reasonForEvidenceTile.id]: player.reasonForEvidenceIndex,
        [victimTile.id]: player.victimIndex,
        [locationTile.id]: player.locationIndex,
      },
      itemGroupIndex: player.itemGroupIndex,
    };
  });
};

type BuiltScenes = {
  scenes: {
    [key: string]: CrimeSceneTile;
  };
  order: string[];
};

export const buildScenes = (
  causeOfDeathTile: CrimeSceneTile,
  reasonForEvidenceTile: CrimeSceneTile,
  victimTile: CrimeSceneTile,
  locationTile: CrimeSceneTile,
): BuiltScenes => {
  const order = [causeOfDeathTile.id, reasonForEvidenceTile.id, victimTile.id, locationTile.id];

  const scenes = {
    [causeOfDeathTile.id]: causeOfDeathTile,
    [reasonForEvidenceTile.id]: reasonForEvidenceTile,
    [victimTile.id]: victimTile,
    [locationTile.id]: locationTile,
  };

  return { scenes, order };
};

export const updateCrime = (crimes: Crime[], players: Players, currentScene: CrimeSceneTile): Crime[] => {
  return crimes.map((crime) => {
    crime.scenes[currentScene.id] = players[crime.playerId].sceneIndex;
    return crime;
  });
};

export const updateOrCreateGuessHistory = (
  crimes: Crime[],
  players: Players,
  groupedItems: GroupedItems,
  store: FirebaseStoreData,
  currentRound: number,
): PlainObject => {
  const results: PlainObject = {};
  // Each history entry shows the
  utils.players.getListOfPlayers(players, true).forEach((player) => {
    const history: GuessHistory = { ...(player.history ?? {}) };
    const wrongGroups: WrongGroups = { ...(player.wrongGroups ?? {}) };
    const wrongItems: WrongItems = { ...(player.wrongItems ?? {}) };
    const result: StringDictionary = {};
    // Count correct crimes
    player.correctCrimes = 0;

    crimes.forEach((crime) => {
      // Only score crimes that is not the user's
      if (crime.playerId !== player.id) {
        if (history[crime.playerId] === undefined) {
          history[crime.playerId] = [];
        }

        // For all other guesses, parse and score
        const guess = player.guesses[crime.playerId];

        // Lock a crime if it was previously correct
        const lastGuess = utils.game.getLastItem(history[crime.playerId]);
        if (lastGuess && [GUESS_STATUS.CORRECT, GUESS_STATUS.LOCKED].includes(lastGuess.status)) {
          history[crime.playerId].push({
            status: GUESS_STATUS.LOCKED,
            weaponId: lastGuess.weaponId,
            evidenceId: lastGuess.evidenceId,
            victimId: lastGuess.victimId ?? '',
            locationId: lastGuess.locationId ?? '',
            groupIndex: lastGuess.groupIndex,
          });
          result[crime.playerId] = GUESS_STATUS.LOCKED;
          return;
        }

        const status = getCrimeGuessStatus(crime, guess, groupedItems);

        // If wrong group, save the wrong group
        const currentGroupIndex = findWhatGroupTheItemBelongsTo(guess, groupedItems);

        history[crime.playerId].push({
          status,
          weaponId: guess.weaponId,
          evidenceId: guess.evidenceId,
          victimId: guess.victimId ?? '',
          locationId: guess.locationId ?? '',
          groupIndex: currentGroupIndex,
        });

        if (status === GUESS_STATUS.CORRECT) {
          player.correctCrimes += 1;
          // Achievements: Correct
          utils.achievements.insert(store, player.id, 'correct', true, currentRound);
        }

        if (wrongGroups[crime.playerId] === undefined) {
          wrongGroups[crime.playerId] = [];
        }

        if (status === GUESS_STATUS.WRONG_GROUP) {
          wrongGroups[crime.playerId].push(currentGroupIndex);
          // Achievements: wrongGroups
          utils.achievements.increase(store, player.id, 'wrongGroups', 1);
        }

        // If player knows the group, eliminate all other groups
        if ([GUESS_STATUS.WRONG, GUESS_STATUS.ONE, GUESS_STATUS.TWO, GUESS_STATUS.THREE].includes(status)) {
          wrongGroups[crime.playerId] = [0, 1, 2, 3].filter((i) => i !== currentGroupIndex);
        }

        if (status === GUESS_STATUS.ONE) {
          // Achievements: Half/One of the two
          utils.achievements.increase(store, player.id, 'one', 1);
          // Achievements: Wrong
          utils.achievements.increase(store, player.id, 'wrong', 1);
        }

        if (status === GUESS_STATUS.TWO) {
          // Achievements: Two of the three
          utils.achievements.increase(store, player.id, 'two', 1);
          // Achievements: Wrong
          utils.achievements.increase(store, player.id, 'wrong', 1);
        }

        if (status === GUESS_STATUS.THREE) {
          // Achievements: Three of the four
          utils.achievements.increase(store, player.id, 'three', 1);
          // Achievements: Wrong
          utils.achievements.increase(store, player.id, 'wrong', 1);
        }

        if (status === GUESS_STATUS.WRONG) {
          // Achievements: Wrong
          utils.achievements.increase(store, player.id, 'wrong', 4);
          // Add all items to the wrong items
          wrongItems[crime.playerId] = wrongItems[crime.playerId] ?? [];
          wrongItems[crime.playerId].push(guess.weaponId, guess.evidenceId);
          if (crime.victimId) {
            wrongItems[crime.playerId].push(guess.victimId);
          }
          if (crime.locationId) {
            wrongItems[crime.playerId].push(guess.locationId);
          }
        }

        if (status !== GUESS_STATUS.LOCKED) {
          // Achievements: Wrong
          utils.achievements.push(store, player.id, 'weapons', guess.weaponId);
          utils.achievements.push(store, player.id, 'evidence', guess.evidenceId);
          if (guess.victimId) {
            utils.achievements.push(store, player.id, 'victims', guess.victimId);
          }
          if (guess.locationId) {
            utils.achievements.push(store, player.id, 'locations', guess.locationId);
          }
        }

        result[crime.playerId] = status;
      } else {
        result[crime.playerId] = 'OWN';
      }
    });

    player.history = history;
    player.wrongGroups = wrongGroups;
    player.wrongItems = wrongItems;
    results[player.id] = result;
  });

  return results;
};

const getCrimeGuessStatus = (crime: Crime, guess: Guess, groupedItems: GroupedItems): string => {
  const isWeaponCorrect = crime.weaponId === guess.weaponId;
  const isEvidenceCorrect = crime.evidenceId === guess.evidenceId;
  const isVictimCorrect = crime.victimId ? crime.victimId === guess.victimId : undefined;
  const isLocationCorrect = crime.locationId ? crime.locationId === guess.locationId : undefined;

  const goal = [isEvidenceCorrect, isWeaponCorrect, isVictimCorrect, isLocationCorrect].filter(
    (e) => e !== undefined,
  );
  const correctCount = goal.filter(Boolean).length;

  if (correctCount === goal.length) {
    return GUESS_STATUS.CORRECT;
  }

  if (correctCount > 0) {
    return ['', GUESS_STATUS.ONE, GUESS_STATUS.TWO, GUESS_STATUS.THREE][correctCount];
  }

  // Check if the quadrant is wrong
  const crimeGroup = groupedItems[crime.itemGroupIndex];
  const isAnyGuessesItemThere = crimeGroup.some((itemId) =>
    [guess.weaponId, guess.evidenceId].includes(itemId),
  );

  return isAnyGuessesItemThere ? GUESS_STATUS.WRONG : GUESS_STATUS.WRONG_GROUP;
};

const findWhatGroupTheItemBelongsTo = (guess: Guess, groupedItems: GroupedItems) => {
  let foundIndex = -1;
  Object.entries(groupedItems).forEach(([groupIndex, group]) => {
    if (group.includes(guess.weaponId) && group.includes(guess.evidenceId)) {
      foundIndex = Number(groupIndex);
      return;
    }
  });
  return foundIndex;
};

type BuiltRanking = {
  ranking: RankingEntry[];
  winners: PlayerId[];
};

type HistoryEntry = [PlayerId, GuessHistoryEntry[]];

export const buildRanking = (players: Players, currentRound: number): BuiltRanking => {
  const winners: PlayerId[] = [];
  // Points granted in reverse round order 1:12, 2:11, 3:10, 4:9, 5:8, 7:6
  const pointMultiplier = TOTAL_ROUNDS + 4 - currentRound;

  const playerCount = utils.players.getPlayerCount(players, true);

  const playersArray = utils.players.getListOfPlayers(players);

  const ranking: RankingEntry[] = playersArray
    .map((player) => {
      const previousScore = player.score;
      let gainedPoints = 0;
      // Update player score
      const win = playerCount - 1 === player.pastCorrectCrimes + player.correctCrimes;
      if (win) {
        winners.push(player.id);
      }

      // Award points
      const history: GuessHistory = player.history;
      Object.entries(history).forEach((entry: HistoryEntry) => {
        const criminalId = entry[0];
        const lastGuess = utils.game.getLastItem(entry[1]);

        switch (lastGuess.status) {
          case GUESS_STATUS.CORRECT:
            player.score += pointMultiplier;
            gainedPoints += pointMultiplier;
            players[criminalId].secretScore += pointMultiplier;
            break;
          case GUESS_STATUS.ONE:
            player.score += 1;
            gainedPoints += 1;
            players[criminalId].secretScore += 1;
            break;
          case GUESS_STATUS.TWO:
            player.score += 2;
            gainedPoints += 2;
            players[criminalId].secretScore += 2;
            break;
          case GUESS_STATUS.THREE:
            player.score += 3;
            gainedPoints += 3;
            players[criminalId].secretScore += 3;
            break;
          default:
          // do nothing
        }
      });

      return {
        playerId: player.id,
        name: player.name,
        previousScore,
        gainedPoints: [gainedPoints],
        newScore: player.score,
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  // If winner, add secret scores
  if (winners.length > 0 || currentRound === TOTAL_ROUNDS) {
    playersArray.forEach((player, index) => {
      player.score += player.secretScore;
      ranking[index].gainedPoints.push(player.secretScore);
      ranking[index].newScore += player.secretScore;
    });
  }

  return {
    ranking,
    winners,
  };
};

export const mockCrimeForBots = (
  players: Players,
  groupedItems: GroupedItems,
  items: Record<string, CrimesHediondosCard>,
  causeOfDeathTile: CrimeSceneTile,
  reasonForEvidenceTile: CrimeSceneTile,
  locationTile: CrimeSceneTile,
  victimTile: CrimeSceneTile,
) => {
  utils.players.getListOfBots(players).forEach((bot) => {
    const itemsGroup = groupedItems[bot.itemGroupIndex];
    const shuffledItems = utils.game.shuffle(itemsGroup);
    const weaponId = shuffledItems.find((e) => e?.includes('wp'));
    const weapon = items[weaponId ?? ''];
    bot.weaponId = weaponId;

    const evidenceId = shuffledItems.find((e) => e?.includes('ev'));
    const evidence = items[evidenceId ?? ''];
    bot.evidenceId = evidenceId;

    const locationId = shuffledItems.find((e) => e?.includes('lc'));
    const location = items[locationId ?? ''];
    if (locationId) {
      bot.locationId = locationId;
    }

    const victimId = shuffledItems.find((e) => e?.includes('vt'));
    const victim = items[victimId ?? ''];
    if (victimId) {
      bot.victimId = victimId;
    }

    // Scene markings
    bot.causeOfDeathIndex = botSmartSceneMarking(causeOfDeathTile, weapon, evidence, location, victim);
    bot.reasonForEvidenceIndex = botSmartSceneMarking(
      reasonForEvidenceTile,
      weapon,
      evidence,
      location,
      victim,
    );
    bot.locationIndex = botSmartSceneMarking(locationTile, weapon, evidence, location, victim);
    bot.victimIndex = botSmartSceneMarking(victimTile, weapon, evidence, location, victim);
  });
};

export const mockGuessingForBots = (players: Players) => {
  utils.players.getListOfBots(players).forEach((bot) => {
    const guesses: Guesses = {};
    utils.players.getListOfPlayers(players, true).forEach((player) => {
      guesses[player.id] = {
        // TODO: Should it be actually guessing?
        weaponId: bot.weaponId,
        evidenceId: bot.evidenceId,
        victimId: bot.victimId ?? '',
        locationId: bot.locationId ?? '',
      };
    });
    bot.guesses = guesses;
  });
};

export const mockSceneMarkForBots = (
  players: Players,
  scene: CrimeSceneTile,
  items: Record<string, CrimesHediondosCard>,
) => {
  utils.players.getListOfBots(players).forEach((bot) => {
    bot.sceneIndex = botSmartSceneMarking(
      scene,
      items[bot.weaponId],
      items[bot.evidenceId],
      items[bot.locationId],
      items[bot.victimId],
    );
  });
};

const getPrioritizedCards = (
  likelihoodPriority: string[],
  weapon?: CrimesHediondosCard,
  evidence?: CrimesHediondosCard,
  location?: CrimesHediondosCard,
  victim?: CrimesHediondosCard,
) => {
  const prioritizedCards: CrimesHediondosCard[] = [];
  likelihoodPriority.forEach((cardType) => {
    if (cardType === 'weapon' && weapon) {
      prioritizedCards.push(weapon);
    }
    if (cardType === 'evidence' && evidence) {
      prioritizedCards.push(evidence);
    }
    if (cardType === 'location' && location) {
      prioritizedCards.push(location);
    }
    if (cardType === 'victim' && victim) {
      prioritizedCards.push(victim);
    }
  });

  return prioritizedCards;
};

const getTheMostLikelySceneValue = (
  sceneId: string,
  prioritizedCards: CrimesHediondosCard[],
  weights: number[] = [],
) => {
  // If prioritizedCards is empty, return 0
  if (prioritizedCards.length === 0) {
    return 0;
  }

  // If there's only one prioritized card, return its likelihood value
  if (prioritizedCards.length === 1) {
    return prioritizedCards[0].likelihood?.[sceneId]?.[0] ?? 0;
  }

  // If there are multiple prioritized cards, calculate the max likelihood of the first two cards, if there's a tie, use the other prioritized cards
  const votes: Record<string, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Add the first 3 values of first card
  votes[prioritizedCards[0].likelihood?.[sceneId]?.[0] ?? 0] += 5 + (weights[0] ?? 0);
  votes[prioritizedCards[0].likelihood?.[sceneId]?.[1] ?? 1] += 3 + (weights[0] ?? 0);
  votes[prioritizedCards[0].likelihood?.[sceneId]?.[2] ?? 2] += 1 + (weights[0] ?? 0);
  // Add the first 3 values of second card
  votes[prioritizedCards[1].likelihood?.[sceneId]?.[0] ?? 0] += 4 + (weights[1] ?? 0);
  votes[prioritizedCards[1].likelihood?.[sceneId]?.[1] ?? 1] += 3 + (weights[1] ?? 0);
  votes[prioritizedCards[1].likelihood?.[sceneId]?.[2] ?? 2] += 1 + (weights[1] ?? 0);
  // Add the first two values of the third card, if any
  if (prioritizedCards[2]) {
    votes[prioritizedCards[2].likelihood?.[sceneId]?.[0] ?? 0] += 2 + (weights[2] ?? 0);
    votes[prioritizedCards[2].likelihood?.[sceneId]?.[1] ?? 1] += 1 + (weights[2] ?? 0);
  }
  // Add the first value of the fourth card, if any
  if (prioritizedCards[3]) {
    votes[prioritizedCards[3].likelihood?.[sceneId]?.[0] ?? 0] += 1 + (weights[3] ?? 0);
  }

  const selectedEntries: number[] = [];
  const maxScore = Math.max(...Object.values(votes));
  Object.entries(votes).forEach(([key, score]) => {
    if (score === maxScore) {
      selectedEntries.push(Number(key));
    }
  });

  if (selectedEntries.length === 1) {
    return selectedEntries[0];
  }

  // If there's a tie, use the first card values as a tie breaker, whatever comes first in the selectedEntries the matches the earliest in the tiebreaker list of values, wins
  const tieBreaker = prioritizedCards[0].likelihood?.[sceneId];

  // Check the index of each selectedEntries in the tieBreaker, the earliest one wins
  return orderBy(selectedEntries, (entry) => tieBreaker?.indexOf(entry) ?? Number.POSITIVE_INFINITY)[0];
};

const botSmartSceneMarking = (
  scene: CrimeSceneTile,
  weapon: CrimesHediondosCard,
  evidence: CrimesHediondosCard,
  location?: CrimesHediondosCard,
  victim?: CrimesHediondosCard,
): number => {
  // Case 1: If the scene has an `specific` property, but not the `likelihoodPriority` property, focus only on the `specific` property
  if (scene?.specific && !scene?.likelihoodPriority) {
    // If it's weapon or evidence, return the index of the specific property
    if (scene.specific === 'weapon') {
      return weapon.likelihood?.[scene.id]?.[0] ?? 0;
    }
    if (scene.specific === 'evidence') {
      return evidence.likelihood?.[scene.id]?.[0] ?? 0;
    }

    // If it's location or victim, return the property of calculate the max for weapon + evidence
    const prioritizedCards = getPrioritizedCards(
      ['weapon', 'evidence', 'location', 'victim'],
      weapon,
      evidence,
      location,
      victim,
    );
    if (scene.specific === 'location') {
      if (location) {
        return location.likelihood?.[scene.id]?.[0] ?? 0;
      }
      return getTheMostLikelySceneValue(scene.id, prioritizedCards);
    }
    if (scene.specific === 'victim') {
      if (victim) {
        return victim.likelihood?.[scene.id]?.[0] ?? 0;
      }
      return getTheMostLikelySceneValue(scene.id, prioritizedCards);
    }
  }

  // Case 2: has specific and likelihoodPriority
  if (scene?.specific && scene?.likelihoodPriority) {
    const prioritizedCards = getPrioritizedCards(
      scene.likelihoodPriority,
      weapon,
      evidence,
      location,
      victim,
    );
    return getTheMostLikelySceneValue(scene.id, prioritizedCards, [2]);
  }

  const prioritizedCards = getPrioritizedCards(
    scene.likelihoodPriority ?? [],
    weapon,
    evidence,
    location,
    victim,
  );

  return getTheMostLikelySceneValue(scene.id, prioritizedCards);
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<CrimesHediondosAchievement>[] = [];

  // Most Wrong groups
  const { most: wrongGroups } = utils.achievements.getMostAndLeastOf(store, 'wrongGroups');
  if (wrongGroups) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_WRONG_GROUPS,
      playerId: wrongGroups.playerId,
      value: wrongGroups.value,
    });
  }

  // Most Wrong Guesses
  const { most: wrong } = utils.achievements.getMostAndLeastOf(store, 'wrong');
  if (wrong) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_WRONG_GUESSES,
      playerId: wrong.playerId,
      value: wrong.value,
    });
  }

  // Most one guesses
  const { most: one } = utils.achievements.getMostAndLeastOf(store, 'one');
  if (one) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_ONE_GUESSES,
      playerId: one.playerId,
      value: one.value,
    });
  }

  // Most two guesses
  const { most: two } = utils.achievements.getMostAndLeastOf(store, 'two');
  if (two) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_TWO_GUESSES,
      playerId: two.playerId,
      value: two.value,
    });
  }

  // Most three guesses
  const { most: three } = utils.achievements.getMostAndLeastOf(store, 'three');
  if (three) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_THREE_GUESSES,
      playerId: three.playerId,
      value: three.value,
    });
  }

  // Earliest Correct Guess
  const { most: latestOccurrence, least: earliestOccurrence } =
    utils.achievements.getEarliestAndLatestOccurrence(store, 'correct');
  if (earliestOccurrence) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.EARLIEST_CORRECT_GUESS,
      playerId: earliestOccurrence.playerId,
      value: earliestOccurrence.value,
    });
  }

  // Latest Correct Guess
  if (latestOccurrence) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.LATEST_CORRECT_GUESS,
      playerId: latestOccurrence.playerId,
      value: latestOccurrence.value,
    });
  }

  // Most Selected Weapons
  const { most: mostWeapons, least: leastWeapons } = utils.achievements.getMostAndLeastUniqueItemsOf(
    store,
    'weapons',
  );
  if (mostWeapons) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_SELECTED_WEAPONS,
      playerId: mostWeapons.playerId,
      value: mostWeapons.value,
    });
  }

  // Fewest Selected Weapons
  if (leastWeapons) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.FEWEST_SELECTED_WEAPONS,
      playerId: leastWeapons.playerId,
      value: leastWeapons.value,
    });
  }

  // Most Selected Evidence
  const { most: mostEvidence, least: leastEvidence } = utils.achievements.getMostAndLeastUniqueItemsOf(
    store,
    'evidence',
  );
  if (mostEvidence) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.MOST_SELECTED_EVIDENCE,
      playerId: mostEvidence.playerId,
      value: mostEvidence.value,
    });
  }

  // Fewest Selected Evidence
  if (leastEvidence) {
    achievements.push({
      type: CRIMES_HEDIONDOS_ACHIEVEMENTS.FEWEST_SELECTED_EVIDENCE,
      playerId: leastEvidence.playerId,
      value: leastEvidence.value,
    });
  }

  return achievements;
};
