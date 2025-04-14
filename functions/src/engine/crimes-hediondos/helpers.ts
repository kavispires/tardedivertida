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
) => {
  // TODO: Fix
  // TODO: Use tags logic for location

  utils.players.getListOfBots(players).forEach((bot) => {
    const itemsGroup = groupedItems[bot.itemGroupIndex];
    const shuffledItems = utils.game.shuffle(itemsGroup);
    const weapon = shuffledItems.find((e) => e?.includes('wp'));
    const evidence = shuffledItems.find((e) => e?.includes('ev'));
    const options = [0, 1, 2, 3, 4, 5];

    bot.weaponId = weapon;
    bot.evidenceId = evidence;

    // Intelligent cause of death
    bot.causeOfDeath = botSmartSceneMarking(causeOfDeathTile, items[bot.weaponId], items[bot.evidenceId]);
    // Intelligent evidence reason
    bot.reasonForEvidence = botSmartSceneMarking(
      reasonForEvidenceTile,
      items[bot.weaponId],
      items[bot.evidenceId],
    );
    bot.locationTile = locationTile.id;
    bot.locationIndex = utils.game.getRandomItem(options);
  });
};

export const mockGuessingForBots = (players: Players) => {
  utils.players.getListOfBots(players).forEach((bot) => {
    const guesses: Guesses = {};
    utils.players.getListOfPlayers(players, true).forEach((player) => {
      guesses[player.id] = {
        // TODO: Fix
        weaponId: bot.weaponId,
        evidenceId: bot.evidenceId,
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
  // TODO: Fix
  utils.players.getListOfBots(players).forEach((bot) => {
    bot.sceneIndex = botSmartSceneMarking(scene, items[bot.weaponId], items[bot.evidenceId]);
  });
};

const botSmartSceneMarking = (
  scene: CrimeSceneTile,
  weapon: CrimesHediondosCard,
  evidence: CrimesHediondosCard,
): number => {
  // If no tags is available for the scene, choose randomly
  const sceneTags = scene?.tags ?? {};
  const hasTags = Object.keys(sceneTags).length > 0;
  if (!hasTags) {
    return utils.game.getRandomNumber(0, 5);
  }

  // If no weapon or evidence tags, choose randomly
  const weaponTags = weapon?.tags ?? [];
  const evidenceTags = evidence?.tags ?? [];
  if (weaponTags.length === 0 && evidenceTags.length === 0) {
    return utils.game.getRandomNumber(0, 5);
  }

  let selectedTags: string[] = [];
  // TODO: Fix
  // Check for exclusivity cases
  if (scene?.specific === 'weapon') {
    selectedTags = weaponTags;
  } else if (scene?.specific === 'evidence') {
    selectedTags = evidenceTags;
  } else {
    selectedTags = [...new Set([...weaponTags, ...evidenceTags])];
  }

  // The any index is used when no matches are made and it should be present at least once in one of the tags
  let anyIndex = -1;

  const scores = Object.values(sceneTags).reduce((acc: number[], entry, index) => {
    if (entry.includes('any')) {
      anyIndex = index;
    }

    if (!acc[index]) {
      acc[index] = 0;
    }

    entry.forEach((entryTag) => {
      if (selectedTags.includes(entryTag)) {
        acc[index] += 1;
      }
    });

    return acc;
  }, []);

  // Gather indexes with the highest scores
  const selectedEntries: number[] = [];

  const maxScore = Math.max(...scores);
  scores.forEach((score, index) => {
    if (score === maxScore) {
      selectedEntries.push(index);
    }
  });

  // If no entry is more likely than others, return any index of random index
  if (selectedEntries.length === 0) {
    return anyIndex > -1 ? anyIndex : utils.game.getRandomNumber(0, 5);
  }

  return utils.game.getRandomItem(selectedEntries);
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
