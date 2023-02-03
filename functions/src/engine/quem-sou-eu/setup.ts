// Constants
import {
  CHARACTERS_PER_PLAYER,
  CHARACTERS_VISIBILITY_PER_ROUND,
  EXTRA_CHARACTERS,
  GLYPHS_PER_ROUND,
  MINIMUM_CHARACTERS,
  QUEM_SOU_EU_PHASES,
  TOTAL_GLYPHS,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type { Character, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildGallery, buildRanking, getAchievements } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine turn order
  const playerCount = utils.players.getPlayerCount(players);

  /**
   * Adds
   */
  let tableCharactersCount = playerCount < MINIMUM_CHARACTERS ? MINIMUM_CHARACTERS - playerCount : 0;
  tableCharactersCount += store.options?.moreCharacters ? EXTRA_CHARACTERS : 0;

  // Get table characters (6 - playerCount)
  const table = utils.game.dealItems(additionalData.characters, tableCharactersCount * TOTAL_ROUNDS);

  // Get 8 characters per player
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.availableCharacters = utils.game.dealItems(additionalData.characters, CHARACTERS_PER_PLAYER);
  });

  const achievements = utils.achievements.setup(players, store, {
    glyphs: 0,
    positive: 0,
    negative: 0,
    single: 0,
    tableVotes: 0,
  });

  // Save
  return {
    update: {
      players,
      store: {
        table,
        tableExtraCount: tableCharactersCount,
        achievements,
      },
      state: {
        phase: QUEM_SOU_EU_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

export const prepareCharacterFilteringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: QUEM_SOU_EU_PHASES.CHARACTER_FILTERING,
      },
      players,
    },
  };
};

export const prepareCharacterDescriptionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['guesses', 'glyphs', 'selectedGlyphs']);

  const glyphs = utils.game.shuffle(utils.game.makeArray(TOTAL_GLYPHS, 1));

  const characters: Record<CardId, Character> = {};

  // Get a character for each player and their glyphs
  utils.players.getListOfPlayers(players).forEach((player, index) => {
    // Deal glyphs
    const glyphsPerPlayer = GLYPHS_PER_ROUND[round.current - 1] ?? 20;
    const startingIndex = index * glyphsPerPlayer;
    player.glyphs = [];
    for (let i = 0; i < glyphsPerPlayer; i++) {
      player.glyphs.push(glyphs[(startingIndex + i) % glyphs.length]);
    }

    // Deal character
    const characterId = player.selectedCharacters[round.current - 1];
    const character = player.availableCharacters.find((c: Character) => c.id === characterId);

    if (character) {
      player.character = character;

      // Add to character dictionary
      characters[character.id] = {
        id: character.id,
        playerId: player.id,
        name: character.name,
      };
    }
  });

  // Add cards from the table
  for (let i = 0; i < store.tableExtraCount; i++) {
    const tableCharacter = store.table[(round.current - 1) * store.tableExtraCount + i];
    characters[tableCharacter.id] = {
      id: tableCharacter.id,
      playerId: 'bot',
      name: tableCharacter.name,
    };
  }

  // Save
  return {
    update: {
      state: {
        phase: QUEM_SOU_EU_PHASES.CHARACTER_DESCRIPTION,
        round,
        characters,
        tableOrder: utils.game.shuffle(Object.keys(characters)),
        roundType: CHARACTERS_VISIBILITY_PER_ROUND[round.current - 1] ? 'SHOW' : 'HIDE',
      },
      players,
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Count achievements: glyphs
  Object.values(players).forEach((player) => {
    const glyphsValues = Object.values(player.selectedGlyphs ?? {});

    // Achievement: Total, Positive and Negative glyphs
    glyphsValues.forEach((value) => {
      utils.achievements.increase(store, player.id, 'glyphs', 1);
      if (value) {
        utils.achievements.increase(store, player.id, 'positive', 1);
      } else {
        utils.achievements.increase(store, player.id, 'negative', 1);
      }
    });

    // Achievement: Selected single icon
    if (glyphsValues.length === 1) {
      utils.achievements.increase(store, player.id, 'single', 1);
    }
  });

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      players,
      state: {
        phase: QUEM_SOU_EU_PHASES.GUESSING,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const gallery = buildGallery(players, state.round.current);
  const ranking = buildRanking(players, state.round.current);

  // TODO: Save to gallery

  // Achievement: Table Votes
  const characters: Record<CardId, Character> = state.characters;
  const botCharacterIds = Object.values(characters)
    .filter((character) => character.playerId === 'bot')
    .map((character) => character.id);
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.values(player.guesses).forEach((guess) => {
      if (botCharacterIds.includes(guess as string)) {
        utils.achievements.increase(store, player.id, 'tableVotes', 1);
      }
    });
  });

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      players,
      state: {
        phase: QUEM_SOU_EU_PHASES.RESULTS,
        gallery,
        ranking,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: QUEM_SOU_EU_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
      },
    },
  };
};
