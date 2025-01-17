// Types
// Constants
import { SINAIS_DE_ALERTA_ACHIEVEMENTS, SINAIS_DE_ALERTA_PHASES, TABLE_CARDS } from './constants';
import type {
  DrawingEntry,
  FinalGalleryEntry,
  FirebaseStoreData,
  GalleryEntry,
  PlayersSay,
  SinaisDeAlertaAchievement,
} from './types';
// Helpers
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { RULES, SETUP, DRAWING, EVALUATION, GALLERY, GAME_OVER } = SINAIS_DE_ALERTA_PHASES;
  const order = [RULES, SETUP, DRAWING, EVALUATION, GALLERY];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === GALLERY) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : DRAWING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return DRAWING;
};

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

const buildId = (descriptorId: CardId, subjectId: CardId, playerId: PlayerId) => {
  return `${descriptorId}-${subjectId}-${playerId}`;
};
const getTitle = (
  cards: Dictionary<TextCard>,
  descriptorId: CardId,
  subjectId: CardId,
  language: Language,
) => {
  if (language === 'pt') {
    return `${cards[subjectId].text} ${cards[descriptorId].text}`;
  }

  return `${cards[descriptorId].text} ${cards[subjectId].text}`;
};

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
  drawings.forEach((drawing) => {
    const newId = buildId(drawing.descriptorId, drawing.subjectId, drawing.playerId);
    const title = getTitle(cards, drawing.descriptorId, drawing.subjectId, language);
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
      utils.achievements.increase(store, player.id, 'chooseForMe', 1);
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
        utils.achievements.increase(store, player.id, 'descriptorGuesses', 1);
        utils.achievements.increase(store, targetPlayerId, 'descriptorDrawings', 1);
        correct++;
      }

      // Verify subject
      if (guess[1] === targetEntry.subjectId) {
        // Achievement: subjectGuesses and subjectDrawings
        utils.achievements.increase(store, player.id, 'subjectGuesses', 1);
        utils.achievements.increase(store, targetPlayerId, 'subjectDrawings', 1);
        correct++;
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<SinaisDeAlertaAchievement>[] = [];

  // Most Guesses: Descriptor
  const { most: mostDescriptorGuesses, least: fewestDescriptorGuesses } =
    utils.achievements.getMostAndLeastOf(store, 'descriptorGuesses');
  if (mostDescriptorGuesses) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.MOST_DESCRIPTORS,
      playerId: mostDescriptorGuesses.playerId,
      value: mostDescriptorGuesses.value,
    });
  }
  if (fewestDescriptorGuesses) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.FEWEST_DESCRIPTORS,
      playerId: fewestDescriptorGuesses.playerId,
      value: fewestDescriptorGuesses.value,
    });
  }

  // Most Guesses: Subject
  const { most: mostSubjectGuesses, least: fewestSubjectGuesses } = utils.achievements.getMostAndLeastOf(
    store,
    'subjectGuesses',
  );
  if (mostSubjectGuesses) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.MOST_SUBJECTS,
      playerId: mostSubjectGuesses.playerId,
      value: mostSubjectGuesses.value,
    });
  }
  if (fewestSubjectGuesses) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.FEWEST_SUBJECTS,
      playerId: fewestSubjectGuesses.playerId,
      value: fewestSubjectGuesses.value,
    });
  }

  // Best drawings: Descriptor
  const { most: bestDescriptor, least: worstDescriptor } = utils.achievements.getMostAndLeastOf(
    store,
    'descriptorDrawings',
  );
  if (bestDescriptor) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.BEST_DESCRIPTOR,
      playerId: bestDescriptor.playerId,
      value: bestDescriptor.value,
    });
  }
  if (worstDescriptor) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.WORST_DESCRIPTOR,
      playerId: worstDescriptor.playerId,
      value: worstDescriptor.value,
    });
  }

  // Best drawings: Subject
  const { most: bestSubject, least: worstSubject } = utils.achievements.getMostAndLeastOf(
    store,
    'subjectDrawings',
  );
  if (bestSubject) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.BEST_SUBJECT,
      playerId: bestSubject.playerId,
      value: bestSubject.value,
    });
  }
  if (worstSubject) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.WORST_SUBJECT,
      playerId: worstSubject.playerId,
      value: worstSubject.value,
    });
  }

  // Table Votes
  const { most: tableVotes } = utils.achievements.getMostAndLeastOf(store, 'tableVotes');
  if (tableVotes) {
    achievements.push({
      type: SINAIS_DE_ALERTA_ACHIEVEMENTS.TABLE_VOTES,
      playerId: tableVotes.playerId,
      value: tableVotes.value,
    });
  }

  return achievements;
};
