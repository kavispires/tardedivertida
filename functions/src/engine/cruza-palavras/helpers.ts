// Types
import type { TextCard } from '../../types/tdr';
import type {
  ClueEntry,
  CruzaPalavrasAchievement,
  CruzaPalavrasOptions,
  Deck,
  FirebaseStoreData,
  GridCell,
  PastClues,
} from './types';
// Constants
import { SEPARATOR } from '../../utils/constants';
import { CRUZA_PALAVRAS_PHASES, CRUZA_PALAVRAS_ACHIEVEMENTS } from './constants';
// Utils
import utils from '../../utils';
import { getListOfPlayers } from '../../utils/players-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  options?: CruzaPalavrasOptions,
): string => {
  const { RULES, SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } = CRUZA_PALAVRAS_PHASES;
  const order = [RULES, SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === SETUP) {
    return options?.gridType === 'imageCards' ? CLUE_WRITING : WORDS_SELECTION;
  }

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : CLUE_WRITING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return CLUE_WRITING;
};

export const buildGrid = (
  words: Deck,
  playersClues: TextCard[],
  wordsPerCoordinate: number,
  shouldUsePlayersClues: boolean,
): GridCell[] => {
  const playersCluesDeck = utils.game.shuffle(playersClues);
  const currentDeck =
    shouldUsePlayersClues && playersCluesDeck.length >= wordsPerCoordinate * 2
      ? playersCluesDeck
      : utils.game.shuffle(words);

  const x: Deck = [
    {
      id: '',
      text: '',
    },
  ];
  const y: Deck = [
    {
      id: '',
      text: '',
    },
  ];

  for (let i = 0; i < wordsPerCoordinate * 2; i++) {
    if (x.length <= wordsPerCoordinate) {
      x.push(currentDeck[i]);
    } else {
      y.push(currentDeck[i]);
    }
  }

  const cells: GridCell[] = [];

  x.forEach((xObj, xIndex) => {
    y.forEach((yObj, yIndex) => {
      // If corner
      if (xIndex === 0 && yIndex === 0) {
        cells.push({
          index: cells.length,
          kind: 'x',
          text: '',
          available: false,
        });
      }

      // If y headers
      else if (xIndex === 0 && yIndex !== 0) {
        cells.push({
          index: cells.length,
          id: yObj.id ?? `_${yObj}`,
          kind: 'header',
          text: yObj.text ?? yObj,
          available: false,
        });
      }

      // If x headers
      else if (yIndex === 0 && xIndex !== 0) {
        cells.push({
          index: cells.length,
          id: xObj.id ?? `_${xObj}`,
          kind: 'header',
          text: xObj.text ?? xObj,
          available: false,
        });
      } else {
        cells.push({
          index: cells.length,
          kind: 'cell',
          text: '',
          available: true,
          id: `${xObj.id}${SEPARATOR}${yObj.id}`,
          x: xIndex,
          y: yIndex,
          xText: xObj.text ?? xObj,
          yText: yObj.text ?? yObj,
          writable: false,
          playerId: null,
        });
      }
    });
  });

  return cells;
};

/**
 * Distribute the available coordinates among players, returning a list of modified grid
 * @param players - this function modifies players
 * @param grid
 * @returns the modified grid
 */
export const distributeCoordinates = (players: Players, grid: GridCell[]): GridCell[] => {
  const available = grid.filter((entry) => entry.available && !entry.playerId);
  const shuffledCoordinates = utils.game.shuffle(available);

  const distribute = (player: Player, cell: GridCell) => {
    if (cell) {
      // Add to player
      player.coordinates.push({
        coordinate: cell.index,
        x: cell.x,
        y: cell.y,
        used: false,
      });

      // update grid
      grid[cell.index].playerId = player.id;
      grid[cell.index].writable = true;
    }
  };

  const listOfPlayers = getListOfPlayers(players);

  listOfPlayers.forEach((player) => {
    const cell = shuffledCoordinates.pop();
    if (cell) {
      distribute(player, cell);
    }
  });

  // If possible to give players a second card, do so
  if (shuffledCoordinates.length >= listOfPlayers.length) {
    listOfPlayers.forEach((player) => {
      if (player.coordinates.length < 2) {
        const cell = shuffledCoordinates.pop();
        if (cell) {
          distribute(player, cell);
        }
      }
    });
  }

  return grid;
};

/**
 * Update grid with players clues
 * @param players
 * @param grid
 * @returns the modified grid
 */
export const updateGridWithPlayersClues = (players: Players, grid: GridCell[]): GridCell[] => {
  utils.players.getListOfPlayers(players).forEach((player) => {
    (player.coordinates ?? []).forEach((coordinate) => {
      if (coordinate.used) {
        grid[coordinate.coordinate].available = false;
        grid[coordinate.coordinate].writable = false;
        grid[coordinate.coordinate].text = player.clue;
      }
    });
  });

  return grid;
};

/**
 * Get clues and coordinates of each player into an array
 * @param players
 * @returns
 */
export const getPlayerClues = (players: Players): ClueEntry[] => {
  return utils.players.getListOfPlayers(players).map((player) => {
    const index = player.coordinates.findIndex(
      (coordinate) => coordinate.coordinate === player.currentClueCoordinate,
    );
    player.coordinates[index].used = true;
    const coordinate = player.coordinates[index].coordinate;

    return {
      playerId: player.id,
      clue: player.clue,
      coordinate,
    };
  });
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @param gallery
 * @returns
 */
export const buildRanking = (players: Players, clues: ClueEntry[], store: FirebaseStoreData) => {
  // Gained Points: [from guesses, one coordinate right, from others, lost points]
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);

  const answers = clues.reduce((acc, entry) => {
    acc[entry.playerId] = entry.coordinate;
    return acc;
  }, {});

  const playerCount = utils.players.getPlayerCount(players);

  const gotPassivePoints: Record<PlayerId, PlayerId[]> = {};

  // Collect points
  utils.players.getListOfPlayers(players).forEach((player) => {
    // Achievement: Chose randomly
    if (player.choseRandomly) {
      utils.achievements.increase(store, player.id, 'chooseForMe', 1);
    }

    Object.entries(player.guesses).forEach(([guessPlayerId, coordinate]) => {
      if (guessPlayerId === player.id) {
        return;
      }

      // Every correct guess gets 2 points
      if (answers[guessPlayerId] === coordinate) {
        scores.add(player.id, 2, 0);
        // Achievement: guesses
        utils.achievements.increase(store, player.id, 'guesses', 1);

        // Every player guessing yours correctly gets 1 point
        scores.add(guessPlayerId, 1, 2);
        // Achievement: clues
        utils.achievements.increase(store, guessPlayerId, 'clues', 1);

        if (gotPassivePoints[guessPlayerId] === undefined) {
          gotPassivePoints[guessPlayerId] = [];
        }
        gotPassivePoints[guessPlayerId].push(player.id);
      } else if (Object.values(answers).includes(coordinate)) {
        // You still get 1 point if you voted the wrong match, but a correct coordinate
        scores.add(guessPlayerId, 1, 0);
      }
    });
  });

  // 0 correct guesses on your clue gets minus player count in points
  const whoGotNoPoints: PlayerId[] = utils.players.getListOfPlayersIds(players).filter((playerId) => {
    if (gotPassivePoints[playerId] === undefined || gotPassivePoints[playerId].length === 0) {
      return true;
    }

    // Achievement: Savior
    if (gotPassivePoints[playerId].length === 1) {
      utils.achievements.increase(store, gotPassivePoints[playerId][0], 'savior', 1);
    }
  });

  whoGotNoPoints.forEach((playerId) => {
    // Achievement: Bad clues
    utils.achievements.increase(store, playerId, 'badClues', 1);
    scores.subtract(playerId, playerCount, 3);
  });

  return {
    ranking: scores.rank(players),
    whoGotNoPoints,
  };
};

export const updatePastClues = (grid: GridCell[], pastClues: PastClues, clues: ClueEntry[]) => {
  clues.forEach(({ coordinate, clue }) => {
    const cell = grid[coordinate];
    if (cell && cell.kind === 'cell' && cell.id) {
      const [id1, id2] = cell.id.split(SEPARATOR);

      if (id1 && id1 !== 'undefined') {
        if (pastClues[id1] === undefined) {
          pastClues[id1] = [];
        }
        pastClues[id1].push(clue);
      }

      if (id2 && id2 !== 'undefined') {
        if (pastClues[id2] === undefined) {
          pastClues[id2] = [];
        }
        pastClues[id2].push(clue);
      }
    }
  });

  return pastClues;
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<CruzaPalavrasAchievement>[] = [];

  // Best Clue Giver: more players got their clues right
  const { most: bestClueGiver } = utils.achievements.getMostAndLeastOf(store, 'clues');
  if (bestClueGiver) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.BEST_CLUES,
      playerId: bestClueGiver.playerId,
      value: bestClueGiver.value,
    });
  }

  // Worst clue giver: got negative points more times
  const { most: worstClueGiver } = utils.achievements.getMostAndLeastOf(store, 'badClues');
  if (worstClueGiver) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.WORST_CLUES,
      playerId: worstClueGiver.playerId,
      value: worstClueGiver.value,
    });
  }

  // Best guesser: guessed the most clues correctly
  const { most: bestGuesses, least: worstGuesser } = utils.achievements.getMostAndLeastOf(store, 'guesses');
  if (bestGuesses) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.BEST_GUESSER,
      playerId: bestGuesses.playerId,
      value: bestGuesses.value,
    });
  }

  // Worst guesser: guesses the most clues incorrectly
  if (worstGuesser) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.WORST_GUESSER,
      playerId: worstGuesser.playerId,
      value: worstGuesser.value,
    });
  }

  // Longest words
  const { most: longest, least: shortest } = utils.achievements.getMostAndLeastOf(store, 'wordLength');
  if (longest) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.LONGEST_WORDS,
      playerId: longest.playerId,
      value: longest.value,
    });
  }

  // Shortest words
  if (shortest) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.SHORTEST_WORDS,
      playerId: shortest.playerId,
      value: shortest.value,
    });
  }

  // Savior
  const { most: savior } = utils.achievements.getMostAndLeastOf(store, 'savior');
  if (savior) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.SAVIOR,
      playerId: savior.playerId,
      value: savior.value,
    });
  }

  // Choose for me: gave up on trying to match the clues the most
  const { most: chooseForMe } = utils.achievements.getMostAndLeastOf(store, 'chooseForMe');
  if (chooseForMe) {
    achievements.push({
      type: CRUZA_PALAVRAS_ACHIEVEMENTS.CHOOSE_FOR_ME,
      playerId: chooseForMe.playerId,
      value: chooseForMe.value,
    });
  }

  return achievements;
};
