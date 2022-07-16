// Types
import { PlainObject, PlayerId, Players, RankingEntry, Round, StringDictionary } from '../../utils/types';
import type { CrimeTile } from '../../utils/tdr';
import type { CrimesHediondosCard } from '../../utils/tdi';
// Constants
import {
  CRIMES_HEDIONDOS_PHASES,
  GUESS_STATUS,
  ITEMS_GROUP_COUNT,
  ITEMS_PER_GROUP,
  SCENE_TILES_COUNT,
  TOTAL_ROUNDS,
} from './constants';
import { Crime, GroupedItems, Guess, GuessHistory, GuessHistoryEntry, WrongGroups } from './types';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER } =
    CRIMES_HEDIONDOS_PHASES;
  const order = [RULES, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return triggerLastRound || (round.current > 0 && round.current === round.total)
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
  console.warn('Missing phase check');
  return SCENE_MARKING;
};

type ParsedTiles = {
  causeOfDeathTile: CrimeTile;
  reasonForEvidenceTile: CrimeTile;
  locationTiles: CrimeTile[];
  sceneTiles: CrimeTile[];
};

export const parseTiles = (sceneTiles: CrimeTile[]): ParsedTiles => {
  const result = sceneTiles.reduce(
    (acc: any, tile: CrimeTile) => {
      if (tile.type === 'cause') {
        acc.causeOfDeathTile = tile;
      } else if (tile.type === 'evidence') {
        acc.reasonForEvidenceTile = tile;
      } else if (tile.type === 'location') {
        acc.locationTiles.push(tile);
      } else {
        acc.sceneTiles.push(tile);
      }

      return acc;
    },
    {
      causeOfDeathTile: {},
      reasonForEvidenceTile: {},
      locationTiles: [],
      sceneTiles: [],
    }
  );

  result.sceneTiles = utils.game.getRandomItems(result.sceneTiles, SCENE_TILES_COUNT);

  return result;
};

type GroupItems = {
  items: {
    [key: string]: CrimesHediondosCard;
  };
  groupedItems: GroupedItems;
};

export const groupItems = (weapons: CrimesHediondosCard[], evidence: CrimesHediondosCard[]): GroupItems => {
  // Divide weapons into 4 groups
  const groupedWeapons = utils.game.sliceIntoChunks(weapons, ITEMS_PER_GROUP);
  // Add evidence into each weapon group
  const groupedEvidence = utils.game.sliceIntoChunks(evidence, ITEMS_PER_GROUP);
  const groupedItems = {};
  groupedEvidence.forEach((evidenceGroup, index) => {
    groupedItems[`${index}`] = [...groupedWeapons[index].map((i) => i.id), ...evidenceGroup.map((i) => i.id)];
  });

  const itemsDict = [...weapons, ...evidence].reduce((acc: PlainObject, item: CrimesHediondosCard) => {
    acc[item.id] = item;
    return acc;
  }, {});

  return {
    items: itemsDict,
    groupedItems,
  };
};

export const dealItemGroups = (players: Players) => {
  Object.keys(players).forEach((playerId) => {
    players[playerId].itemGroupIndex = Math.round(Math.random() * 100) % ITEMS_GROUP_COUNT;
  });
};

export const buildCrimes = (
  players: Players,
  causeOfDeathTile: CrimeTile,
  reasonForEvidenceTile: CrimeTile
): Crime[] => {
  return Object.values(players).map((player) => {
    return {
      playerId: player.id,
      weaponId: player.weaponId,
      evidenceId: player.evidenceId,
      scenes: {
        [causeOfDeathTile.id]: player.causeOfDeath,
        [reasonForEvidenceTile.id]: player.reasonForEvidence,
        [player.locationTile]: player.locationIndex,
      },
      itemGroupIndex: player.itemGroupIndex,
    };
  });
};

type BuiltScenes = {
  scenes: {
    [key: string]: CrimeTile;
  };
  order: string[];
};

export const buildScenes = (
  causeOfDeathTile: CrimeTile,
  reasonForEvidenceTile: CrimeTile,
  locationTiles: CrimeTile[],
  players: Players
): BuiltScenes => {
  const locationsUsedByPlayers = Object.values(players).map((player) => player.locationTile);
  const locations = locationTiles.filter((locationTile) => locationsUsedByPlayers.includes(locationTile.id));

  const order = [causeOfDeathTile.id, reasonForEvidenceTile.id, ...locations.map((location) => location.id)];

  const scenes = {
    [causeOfDeathTile.id]: causeOfDeathTile,
    [reasonForEvidenceTile.id]: reasonForEvidenceTile,
  };

  locations.forEach((location) => (scenes[location.id] = location));

  return { scenes, order };
};

export const updateCrime = (crimes: Crime[], players: Players, currentScene: CrimeTile): Crime[] => {
  return crimes.map((crime) => {
    crime.scenes[currentScene.id] = players[crime.playerId].sceneIndex;
    return crime;
  });
};

export const updateOrCreateGuessHistory = (
  crimes: Crime[],
  players: Players,
  groupedItems: GroupedItems
): PlainObject => {
  const results: PlainObject = {};
  // Each history entry shows the
  Object.values(players).forEach((player) => {
    const history: GuessHistory = { ...player.history } ?? {};
    const wrongGroups: WrongGroups = { ...player.wrongGroups } ?? {};
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
            weaponId: lastGuess.weaponId,
            evidenceId: lastGuess.evidenceId,
            status: GUESS_STATUS.LOCKED,
            groupIndex: lastGuess.groupIndex,
          });
          result[crime.playerId] = GUESS_STATUS.LOCKED;
          return;
        }

        const status = getCrimeGuessStatus(crime, guess, groupedItems);

        // If wrong group, save the wrong group
        const groupIndex = findWhatGroupTheItemBelongsTo(guess, groupedItems);

        history[crime.playerId].push({
          weaponId: guess.weaponId,
          evidenceId: guess.evidenceId,
          status,
          groupIndex,
        });

        if (status === GUESS_STATUS.CORRECT) {
          player.correctCrimes += 1;
        }

        if (status === GUESS_STATUS.WRONG_GROUP) {
          if (wrongGroups[crime.playerId] === undefined) {
            wrongGroups[crime.playerId] = [];
          }
          wrongGroups[crime.playerId].push(groupIndex);
        }

        result[crime.playerId] = status;
      } else {
        result[crime.playerId] = 'OWN';
      }
    });

    player.history = history;
    player.wrongGroups = wrongGroups;
    results[player.id] = result;
  });

  return results;
};

const getCrimeGuessStatus = (crime: Crime, guess: Guess, groupedItems: GroupedItems): string => {
  const isWeaponCorrect = crime.weaponId === guess.weaponId;
  const isEvidenceCorrect = crime.evidenceId === guess.evidenceId;
  const bothCorrect = isWeaponCorrect && isEvidenceCorrect;
  const eitherCorrect = isWeaponCorrect || isEvidenceCorrect;

  if (eitherCorrect) {
    return bothCorrect ? GUESS_STATUS.CORRECT : eitherCorrect ? GUESS_STATUS.HALF : GUESS_STATUS.WRONG;
  }

  // Check if the quadrant is wrong
  const crimeGroup = groupedItems[crime.itemGroupIndex];
  const isAnyGuessesItemThere = crimeGroup.some((itemId) =>
    [guess.weaponId, guess.evidenceId].includes(itemId)
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
  // Points granted in reverse round order 1:7, 2:6, 3:4, 4:3, 5:6, 7:1
  const pointMultiplier = TOTAL_ROUNDS + 1 - currentRound;

  const playerCount = Object.keys(players).length;

  const playersArray = Object.values(players);

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
          case GUESS_STATUS.HALF:
            player.score += 1;
            gainedPoints += 1;
            players[criminalId].secretScore += 1;
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
