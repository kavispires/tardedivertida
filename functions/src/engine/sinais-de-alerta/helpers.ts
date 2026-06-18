// Types
// Constants
import { SINAIS_DE_ALERTA_PHASES, TABLE_CARDS } from './constants';
import type { DrawingEntry, FinalGalleryEntry, FirebaseStoreData, GalleryEntry, PlayersSay } from './types';
// Helpers
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, DRAWING, EVALUATION, GALLERY, GAME_OVER } = SINAIS_DE_ALERTA_PHASES;
  const order = [SETUP, DRAWING, EVALUATION, GALLERY];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === GALLERY) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : DRAWING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Deals subject and descriptor cards to all players and table
 * @param players - The collection of players in the game
 * @param store - The Firebase store data
 */
export const dealCardsToPlayers = (players: Players, store: FirebaseStoreData) => {
  const playersArray = utils.players.getListOfPlayers(players);

  const cards: Dictionary<TextCard> = {};

  playersArray.forEach((player) => {
    const subject = store.subjectsDeck.pop();
    if (subject) {
      cards[subject.id] = subject;
      player.currentSubjectId = subject.id;
    }
    const descriptor = store.descriptorsDeck.pop();
    if (descriptor) {
      cards[descriptor.id] = descriptor;
      player.currentDescriptorId = descriptor.id;
    }
  });

  // Deal table cards
  for (let i = 0; i < TABLE_CARDS; i++) {
    const subject = store.subjectsDeck.pop();
    if (subject) {
      cards[subject.id] = subject;
    }
    const descriptor = store.descriptorsDeck.pop();
    if (descriptor) {
      cards[descriptor.id] = descriptor;
    }
  }

  return cards;
};

const buildId = (descriptorId: UID, subjectId: UID, playerId: UID) => {
  return `${descriptorId}-${subjectId}-${playerId}`;
};
const getTitle = (cards: Dictionary<TextCard>, descriptorId: UID, subjectId: UID, language: Language) => {
  if (language === 'pt') {
    return `${cards[subjectId].text} ${cards[descriptorId].text}`;
  }

  return `${cards[descriptorId].text} ${cards[subjectId].text}`;
};

/**
 * Evaluates player guesses against actual drawings and calculates scores
 * @param drawings - The array of drawing entries
 * @param players - The collection of players in the game
 * @param cards - The dictionary of all text cards
 * @param store - The Firebase store data for tracking achievements
 */
export const evaluateAnswers = (
  drawings: DrawingEntry[],
  players: Players,
  cards: Dictionary<TextCard>,
  store: FirebaseStoreData,
) => {
  const { language } = store;
  // Gained Points: [guesses, drawing]
  const scores = new utils.players.Scores(players, [0, 0]);

  // Guess: [playerId]: [descriptorId, subjectId]
  const gallery: Dictionary<GalleryEntry> = {};
  const finalGallery: Dictionary<FinalGalleryEntry> = {};
  const cardsFromPlayers: Dictionary<boolean> = {};
  drawings.forEach((drawing) => {
    const newId = buildId(drawing.descriptorId, drawing.subjectId, drawing.playerId);
    const title = getTitle(cards, drawing.descriptorId, drawing.subjectId, language);
    cardsFromPlayers[drawing.subjectId] = true;
    cardsFromPlayers[drawing.descriptorId] = true;
    gallery[drawing.playerId] = {
      id: newId,
      title: title,
      subjectId: drawing.subjectId,
      descriptorId: drawing.descriptorId,
      artistId: drawing.playerId,
      artistScore: 0,
      drawing: drawing.drawing,
      playersSay: [],
      accuracy: 0,
      correctness: 0,
    };
    finalGallery[newId] = {
      id: newId,
      title: title,
      playerId: drawing.playerId,
      drawing: drawing.drawing,
      accuracy: 0,
    };
  });

  utils.players.getListOfPlayers(players).forEach((player) => {
    // Achievement: choseRandomly
    if (player.choseRandomly) {
      increaseAchievement(store.achievements, player.id, 'chooseForMe', 1);
    }

    Object.entries(player.guesses).forEach(([targetPlayerId, g]) => {
      if (targetPlayerId === player.id) {
        return;
      }
      const guess: [string, string] = g as [string, string];
      const targetEntry = gallery[targetPlayerId];

      let correct = 0;
      // Verify descriptor
      if (guess[0] === targetEntry.descriptorId) {
        // Achievement: descriptorGuesses and descriptorDrawings
        increaseAchievement(store.achievements, player.id, 'descriptorGuesses', 1);
        increaseAchievement(store.achievements, targetPlayerId, 'descriptorDrawings', 1);
        correct++;
      }
      // Verify if it's a table vote
      else if (!cardsFromPlayers[guess[0]]) {
        increaseAchievement(store.achievements, player.id, 'tableVotes', 1);
      }

      // Verify subject
      if (guess[1] === targetEntry.subjectId) {
        // Achievement: subjectGuesses and subjectDrawings
        increaseAchievement(store.achievements, player.id, 'subjectGuesses', 1);
        increaseAchievement(store.achievements, targetPlayerId, 'subjectDrawings', 1);
        correct++;
      } else if (!cardsFromPlayers[guess[1]]) {
        increaseAchievement(store.achievements, player.id, 'tableVotes', 1);
      }

      if (correct === 2) {
        // If both are correct, both players get points
        targetEntry.artistScore += 2;
        scores.add(targetPlayerId, 2, 1);
        scores.add(player.id, 3, 0);
      } else if (correct === 1) {
        // If only one is correct, only drawer gets points
        scores.add(targetPlayerId, 1, 1);
        targetEntry.artistScore += 1;
      }

      // Update gallery
      targetEntry.playersSay.push({
        playersIds: [player.id],
        descriptorId: guess[0],
        subjectId: guess[1],
        score: correct === 2 ? 3 : 0,
      });

      targetEntry.correctness = Math.max(targetEntry.correctness, correct);

      // Update accuracy
      targetEntry.accuracy += correct;
    });
  });

  // Cleanup playersSay
  Object.values(gallery).forEach((entry) => {
    const result: Dictionary<PlayersSay> = {};
    entry.playersSay.forEach((say) => {
      const key = `${say.descriptorId}-${say.subjectId}`;
      if (!result[key]) {
        result[key] = say;
      } else {
        result[key].playersIds.push(...say.playersIds);
      }
    });
    entry.playersSay = Object.values(result);
  });

  const pastDrawings = Object.values(finalGallery).map((entry) => ({
    ...entry,
    accuracy: gallery[entry.playerId].accuracy / ((utils.players.getPlayerCount(players) - 1) * 2),
  }));

  return {
    gallery: Object.values(gallery),
    ranking: scores.rank(players),
    pastDrawings,
  };
};
