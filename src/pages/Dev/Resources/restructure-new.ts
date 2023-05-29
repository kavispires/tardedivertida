import { has, isEmpty, set } from 'lodash';
import {
  DEFAULT_STATE_PROPS,
  DEFAULT_STORE_PROPS,
  addPlayToPlayers,
  addUsers,
  checkGameCompletion,
  checkPreviouslyParsedId,
  cleanupFirefooObject,
  cleanupPlayers,
  getLastUpdatedPlayerDate,
  getWinners,
  saveSession,
  stripInObject,
} from './restructure-utils';
import { getRestructureState } from './restructure-state';
import { removeDuplicates } from 'utils/helpers';

type TBD = PlainObject;

// Global Dictionaries
export const GLOBAL_USED_GAME_IDS: NumberDictionary = {};
export const GLOBAL_USED_ARTE_RUIM_CARDS: BooleanDictionary = {};
export const GLOBAL_USED_ALIEN_ITEMS: BooleanDictionary = {};
export const GLOBAL_USED_IMAGE_CARDS: BooleanDictionary = {};
export const GLOBAL_USED_OBJECTS: BooleanDictionary = {};
export const GLOBAL_USED_QUESTIONS: BooleanDictionary = {};
export const GLOBAL_USED_OPPOSING_IDEAS: BooleanDictionary = {};
export const GLOBAL_USED_CONTENDERS: BooleanDictionary = {};
export const GLOBAL_USED_MONSTERS: BooleanDictionary = {};
export const GLOBAL_USED_CHALLENGES: BooleanDictionary = {};
export const GLOBAL_USED_SUSPECTS: BooleanDictionary = {};
export const GLOBAL_USED_TESTIMONY_QUESTIONS: BooleanDictionary = {};
export const GLOBAL_USED_MOVIES_AND_REVIEWS: BooleanDictionary = {};
export const GLOBAL_USED_SINGLE_WORDS: BooleanDictionary = {};

// Data Dictionaries
export const DATA_DRAWINGS: TBD = {};
export const DATA_MONSTER_DRAWINGS: TBD = {};
export const DATA_IMAGE_CARD_STORY_PT: Record<ImageCardId, string[]> = {};
export const DATA_IMAGE_CARD_STORY_EN: Record<ImageCardId, string[]> = {};
export const DATA_CARD_STORY_PT: Record<CardId, string[]> = {};
export const DATA_CARD_STORY_EN: Record<CardId, string[]> = {};
export const DATA_OPPOSING_IDEAS_CLUES: Record<CardId, OpposingIdeaClue[]> = {};
export const DATA_CONTENDER_GLYPHS: Record<CardId, BooleanDictionary> = {};
export const DATA_SUSPECT_ANSWERS: Record<CardId, Record<CardId, boolean>> = {};

// Meta Dictionaries
export const META: Record<GameId, GameMeta> = {};

// Users Dictionary
export const USERS: Record<UID, FirebaseUserDB> = {};

// Games Dictionary
export const GAMES: GameLibraries = {};

// Skipped Games
export const SKIPPED_GAMES: PlainObject = {};

// Flagged Games
export const FLAGGED_GAMES: BooleanDictionary = {};

// Read names from game info to load each json file

/**
 * Parse each game:
 * - save global/usedGameId : with timestamp if game is complete
 * - save meta
 * - save players as users
 * - save game with state and store (with players inside state)
 */

/**
 *
 * @param metas
 * @param gameId
 * @param data
 * @returns
 */
const checkBasics = (metas: Metas, gameId: GameId, data: PlainObject) => {
  const meta = cleanupFirefooObject(metas?.[gameId] ?? data?.meta);
  const gameEndedAt =
    data?.state?.gameEndedAt || getLastUpdatedPlayerDate(data?.players ?? {}) || meta?.createdAt;

  console.log(`%c Running ${gameId}`, 'color:CornflowerBlue');

  // Check if is complete
  const isComplete = checkGameCompletion(metas, gameId, data, data?.state);

  // Check if it's a duplicated game
  const idEntries = Object.entries(GLOBAL_USED_GAME_IDS);
  const duplicatedGame = idEntries.find(([_, value]) => value === gameEndedAt);
  const isDuplicate = Boolean(duplicatedGame);
  if (duplicatedGame) {
    console.log({ DUPLICATED_GAME: `${gameId} = ${duplicatedGame[0]}` });
  }

  // Save userGameId
  const isPreviouslyUsed = checkPreviouslyParsedId(
    gameId,
    gameEndedAt,
    data,
    isComplete,
    isDuplicate,
    meta as GameMeta
  );

  // Add language
  try {
    data.store.language = data?.store?.language ?? meta?.language ?? 'pt';
  } catch (_) {
    console.log({ NO_STORE_LANGUAGE: data });
  }

  return {
    meta,
    gameEndedAt,
    isComplete,
    isPreviouslyUsed,
    isDuplicate,
  };
};

const checkShouldSkip = (key: string) => {
  return getRestructureState('DONE_CHECK_LIST')[key];
};

const printLog = (key: string, games: PlainObject) => {
  console.log(`%c Parsing... ${key} (${Object.keys(games).length})`, 'color:dodgerblue');
};

const updateDataImageCardStories = (cardId: ImageCardId, text: string, language: Language) => {
  const source = language === 'pt' ? DATA_IMAGE_CARD_STORY_PT : DATA_IMAGE_CARD_STORY_EN;
  if (!has(source, cardId)) {
    source[cardId] = [];
  }
  source[cardId].push(text);

  source[cardId] = removeDuplicates(source[cardId]);
};

type onRunProps = (data: PlainObject, meta: GameMeta, gameEndedAt: DateMilliseconds) => void;

type ParseDefaultProps = {
  key: string;
  metas: Metas;
  games: PlainObject;
  keepStoreKeys?: string[];
  keepPlayerKeys?: string[];
  keepStateKeys?: string[];
  onRunIncomplete?: onRunProps;
  onRunBeforeStore?: onRunProps;
  onRunBeforePlayers?: onRunProps;
  onRunBeforeState?: onRunProps;
  onRunAfterAll?: onRunProps;
  testing?: boolean;
};

/**
 * Default Parser
 */
export function parser({
  key,
  metas,
  games,
  keepStoreKeys = [],
  keepPlayerKeys = [],
  keepStateKeys = [],
  onRunIncomplete = () => {},
  onRunBeforeStore = () => {},
  onRunBeforePlayers = () => {},
  onRunBeforeState = () => {},
  onRunAfterAll = () => {},
  testing = false,
}: ParseDefaultProps) {
  const shouldSkip = checkShouldSkip(key);
  if (shouldSkip) return;
  printLog(key, games);

  Object.entries(games).forEach(([gameId, data]) => {
    const { meta, gameEndedAt, isComplete, isPreviouslyUsed, isDuplicate } = checkBasics(metas, gameId, data);
    if (isPreviouslyUsed) return;

    if (testing) {
      console.log(data);
      return;
    }

    onRunIncomplete(data, meta as GameMeta, gameEndedAt);

    // STOP IF
    if (!isComplete) {
      console.log(`%c Stopping ${gameId}: Incomplete`, 'color:Coral');
      return;
    }

    if (isDuplicate) {
      console.log(`%c Stopping ${gameId}: Duplicate`, 'color:Coral');
      return;
    }
    console.count(`Continuing... ${key.toLocaleLowerCase()}`);

    onRunBeforeStore(data, meta as GameMeta, gameEndedAt);

    // Handle STORE
    const store = stripInObject(data.store, gameId, [...DEFAULT_STORE_PROPS, ...keepStoreKeys]);

    onRunBeforePlayers(data, meta as GameMeta, gameEndedAt);

    // Handle PLAYERS
    const players = cleanupPlayers(data.players ?? data.state?.players, gameId, keepPlayerKeys);

    onRunBeforeState(data, meta as GameMeta, gameEndedAt);

    // Cleanup state and add players
    data.state.gameEndedAt = gameEndedAt;
    data.state.winners = getWinners(data);

    const state = stripInObject(data.state, gameId, [...DEFAULT_STATE_PROPS, ...keepStateKeys]) as GameState;
    state.players = players;

    onRunAfterAll(data, meta as GameMeta, gameEndedAt);

    // Handle USERS
    addUsers(players, store.language);

    // Build user gameEntry
    addPlayToPlayers({
      gameName: meta.gameName,
      gameId,
      startedAt: meta.createdAt,
      endedAt: gameEndedAt,
      players,
      winners: state.winners ?? [],
      achievements: state.achievements ?? [],
    });

    // Set game data
    saveSession(key, meta as GameMeta, store, state);
  });
}

/**
 * Arte Ruim
 * - save global/usedArteRuimCards
 * - save data/drawings
 */
export function parseArteRuimGames(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['pastDrawings'],
    keepStateKeys: ['drawings'],
    onRunIncomplete: (data, meta, gameEndedAt) => {
      // Parse store: get userCards and drawings

      if (data.store?.pastDrawings) {
        data.store.pastDrawings = data.store.pastDrawings
          .map((entry: PlainObject) => {
            if (!entry.id) {
              console.log({ NOT_ENTRY_ID: data });
              return null;
            }
            const cardId = entry.id.startsWith('a') ? entry.id : `a-${entry.id}-pt`;
            const id = `${cardId}::${gameEndedAt}`;
            delete entry.id;
            const newEntry = stripInObject(
              {
                text: '?',
                level: '0',
                successRate: 0,
                playerId: entry?.playerName ?? '',
                ...entry,
                cardId,
              },
              meta.gameId,
              ['drawing', 'level', 'playerId', 'cardId', 'text', 'successRate']
            );

            set(DATA_DRAWINGS, id, newEntry);
            if (!cardId.includes('--')) {
              set(GLOBAL_USED_ARTE_RUIM_CARDS, cardId, true);
            }
            return newEntry;
          })
          .filter(Boolean);
      }

      if (data.store?.previousDrawings) {
        data.store.previousDrawings = (data.store.pastDrawings || data.store.previousDrawings)
          .map((entry: PlainObject) => {
            if (!entry.cardId) {
              console.log({ NOT_ENTRY_ID: data });
              return null;
            }
            const cardId = entry.cardId.startsWith('a') ? entry.cardId : `a-${entry.cardId}-pt`;
            const id = `${cardId}::${gameEndedAt}`;
            const newEntry = stripInObject(
              {
                text: '?',
                level: '0',
                successRate: 0,
                playerId: entry?.playerName ?? '',
                ...entry,
                cardId,
              },
              meta.gameId,
              ['drawing', 'level', 'playerId', 'cardId', 'text', 'successRate']
            );

            set(DATA_DRAWINGS, id, newEntry);
            if (!cardId.includes('--')) {
              set(GLOBAL_USED_ARTE_RUIM_CARDS, cardId, true);
            }
            return newEntry;
          })
          .filter(Boolean);
        if (data.store.previousDrawings) {
          data.store.pastDrawings = data.store.previousDrawings;
          delete data.store.previousDrawings;
        }
      }

      if (!data.store.pastDrawings) {
        console.log({ NOT_PAST_DRAWINGS: meta.gameId, data });
      }
    },
    onRunAfterAll: (data) => {
      if (!data.state.drawings && data.store.pastDrawings) {
        data.state.drawings = data.store.pastDrawings;
      }
      delete data.store.pastDrawings;
    },
  });
}

/**
 * Comunicacao Alienigena
 * - save data/usedAlienObjects
 * - save game with state and store (with players inside state)
 */
export function parseComunicacaoAlienigenaGames(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: ['role'],
    keepStateKeys: ['inquiryHistory', 'isAlienBot', 'items', 'requestHistory', 'signs', 'status'],
    onRunAfterAll: (data) => {
      // Handle GLOBAL_USED_ALIEN_ITEMS
      if (data.state.items) {
        data.state.items.forEach((entry: PlainObject) => {
          set(GLOBAL_USED_ALIEN_ITEMS, entry.id, true);
        });
      }
    },
  });
}

/**
 * Contadores de Historias
 * - save global/usedImageCards
 * - saved data/card-story
 */
export function parseContadoresHistoria(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: [],
    keepStateKeys: ['book'],
    onRunIncomplete: (data) => {
      // Handle past stories
      if (data.store.solutionCardId && data.store.story) {
        data.state.book = [{ cardId: data.store.solutionCardId, story: data.store.story, playerId: '' }];
        updateDataImageCardStories(
          data.store.solutionCardId,
          (data.store.story ?? '').toLowerCase(),
          data.store.language
        );
      }
    },
    onRunAfterAll: (data) => {
      if (data.state.book) {
        data.state.book.forEach((entry: PlainObject) => {
          set(GLOBAL_USED_IMAGE_CARDS, entry.cardId, true);
        });
      }
    },
  });
}

/**
 * Crimes Hediondos
 * - save global/usedObjects
 */
export function parseCrimesHediondos(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: [],
    keepStateKeys: ['crimes', 'groupedItems', 'items', 'scenes', 'scenesOrder'],
    onRunBeforeState: (data) => {
      // Handle GLOBAL_USED_OBJECT_CARDS
      if (data.state.crimes) {
        data.state.crimes.forEach((entry: PlainObject) => {
          if (entry.evidenceId) {
            set(GLOBAL_USED_OBJECTS, entry.evidenceId, true);
          }
          if (entry.weaponId) {
            set(GLOBAL_USED_OBJECTS, entry.weaponId, true);
          }
        });
      }
    },
  });
}

/**
 * Cruza Palavras
 */
export function parseCruzaPalavras(key: string, metas: Metas, games: PlainObject) {
  parser({ key, metas, games });
}

/**
 * Detetives Imaginativos
 * - save global/usedImageCards X
 */
export function parseDetetivesImaginativos(key: string, metas: Metas, games: PlainObject) {
  parser({ key, metas, games });
}

/**
 * Espião Entre Nós
 */
export function parseEspiaoEntreNos(key: string, metas: Metas, games: PlainObject) {
  parser({ key, metas, games });
}

/**
 * Galeria de Sonhos
 * - save global/usedImageCards
 * - save data/imageCardStory X
 */
export function parseGaleriaDeSonhos(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: [],
    keepStateKeys: ['bestMatches', 'table'],
    onRunAfterAll: (data) => {
      if (data.state.bestMatches || data.state.table) {
        (data.state.bestMatches || data.state.table).forEach((entry: PlainObject) => {
          set(GLOBAL_USED_IMAGE_CARDS, entry.id, true);
          if (entry.text) {
            updateDataImageCardStories(entry.id, entry.text, data.store.language);
          } else {
            console.log({ entry });
          }
        });
      }
    },
  });
}

/**
 * linhas-cruzadas
 * - save global/drawing
 */
export function parseLinhasCruzadas(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: [],
    keepStateKeys: ['album'],
    onRunAfterAll: (data, meta, gameEndedAt) => {
      if (data.state.album) {
        data.state.album.forEach((entry: PlainObject) => {
          const { slides, cardId, id } = entry;

          if (cardId && slides[1].content && slides[2].content) {
            const entryId = `${cardId}::${gameEndedAt}`;
            const newEntry = {
              text: slides[1].content,
              level: '0',
              successRate: 0,
              playerId: id ?? '',
              drawing: slides[2].content,
              cardId,
            };
            set(DATA_DRAWINGS, entryId, newEntry);

            if (cardId.startsWith('a-')) {
              set(GLOBAL_USED_ARTE_RUIM_CARDS, cardId, true);
            }
          }
        });
      }
    },
  });
}

/**
 * megamix
 * - save global/drawing X
 */
export function parseMegamix(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['tasks'],
    keepPlayerKeys: ['clubberId'],
    keepStateKeys: ['farWinners'],
  });
}

/**
 * Mente Coletiva
 * - save global/usedQuestions
 */
export function parseMenteColetiva(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['pastQuestions'],
    keepPlayerKeys: ['sheepId', 'level'],
    keepStateKeys: ['losers'],
    onRunBeforePlayers: (data) => {
      if (data.store.pastQuestions) {
        data.store.pastQuestions.forEach((questionId: string) => {
          if (questionId.startsWith('m-')) {
            set(GLOBAL_USED_QUESTIONS, questionId, true);
          }
        });
      }
    },
  });
}

/**
 * Na Rua do Medo
 */
export function parseNaRuaDoMedo(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: ['costumeId', 'hand', 'jackpots', 'totalCandy'],
    keepStateKeys: [],
  });
}

/**
 * Onda Telepatica
 * - save opposingIdea CardId
 * - save opposingIdea clue and target
 */
export function parseOndaTelepatica(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepPlayerKeys: [],
    keepStateKeys: ['pastCategories'],
    onRunIncomplete: (data) => {
      if (data.state.pastCategories || data.store.pastCategories) {
        (data.state.pastCategories ?? data.store.pastCategories).forEach((entry: PlainObject) => {
          set(GLOBAL_USED_OPPOSING_IDEAS, entry.id, true);
          set(DATA_OPPOSING_IDEAS_CLUES, entry.id, { [entry.target]: [entry.clue] });
        });

        if (data.store.pastCategories && !data.state.pastCategories) {
          data.state.pastCategories = data.store.pastCategories;
        }
        delete data.store.pastCategories;
      }
    },
  });
}

/**
 * Polemica da Vez
 */
export function parsePolemicaDaVez(key: string, metas: Metas, games: PlainObject) {
  parser({ key, metas, games });
}

/**
 * Porta dos Desesperados
 * - save used ImageCards X
 * - save imageCard association? X
 */
export function parsePortaDosDesesperados(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['traps'],
    keepStateKeys: ['winCondition', 'magic', 'currentCorridor'],
  });
}

/**
 * Quem sou Eu
 * - save usedContenders
 * - save contenders glyphs
 */
export function parseQuemSouEu(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['contendersGlyphs'],
    keepStateKeys: ['gallery'],
    onRunIncomplete: (data) => {
      if (!isEmpty(data.store.contendersGlyphs)) {
        Object.entries(data.store.contendersGlyphs).forEach(([cardId, glyphs]) => {
          set(DATA_CONTENDER_GLYPHS, cardId, glyphs);
          set(GLOBAL_USED_CONTENDERS, cardId, true);
        });
      }
    },
  });
}

/**
 * Retrato falado
 * - save usedMonsters
 * - save monster sketches
 */
export function parseRetratoFalado(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: [],
    keepStateKeys: ['gallery'],
    onRunIncomplete: (data) => {
      if (data.state.gallery) {
        data.state.gallery.forEach((entry: PlainObject) => {
          set(DATA_MONSTER_DRAWINGS, `${entry.id}::${entry.playerId}`, entry.sketch);
          set(GLOBAL_USED_MONSTERS, entry.id, true);
        });
      }

      if (data.store.pastSketches) {
        data.store.pastSketches.forEach((entry: PlainObject) => {
          set(DATA_MONSTER_DRAWINGS, `${entry.id}::${entry.playerId}`, entry.sketch);
          set(GLOBAL_USED_MONSTERS, entry.id, true);
        });
      }

      if (!data.state.gallery && data.store.pastSketches) {
        data.state.gallery = data.store.pastSketches;
      }

      // Get any sketches from incomplete games
      if (data.state?.sketches) {
        data.state.sketches.forEach((entry: PlainObject) => {
          if (entry.sketch && entry.sketch.length > 3) {
            set(DATA_MONSTER_DRAWINGS, `${entry.id}::${entry.playerId}`, entry.sketch);
            set(GLOBAL_USED_MONSTERS, entry.id, true);
          }
        });
      }

      // If any player has sketches, parse those too
      const currentMonsterId = data.state?.currentMonster?.id ?? data.state?.gallery?.at(-1)?.id;

      if (currentMonsterId) {
        Object.values(data.players).forEach((p) => {
          const player = p as GamePlayer;
          if (player.sketch && player.sketch.length > 3) {
            set(DATA_MONSTER_DRAWINGS, `${currentMonsterId}::${player.id}`, player.sketch);
            set(GLOBAL_USED_MONSTERS, currentMonsterId, true);
          }
        });
      }
    },
  });
}

/**
 * Sonhos e Pesadelos
 */
export function parseSonhosPesadelos(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
  });
}

/**
 * Super Campeonato
 * - save used contenders
 */
export function parseSuperCampeonato(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStateKeys: ['finalWinner'],
    onRunIncomplete: (data) => {
      if (data.store.finalBrackets) {
        data.store.finalBrackets.forEach((entry: PlainObject) => {
          if (!entry.id.startsWith('cntb')) {
            set(GLOBAL_USED_CONTENDERS, entry.id, true);
          }
        });
      }
    },
  });
}

/**
 * Ta Na Cara
 * - save used questions
 * - save used suspects
 * - save data suspect answers
 */
export function parseTaNaCara(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    onRunIncomplete: (data) => {
      if (data.store.usedCharacters) {
        Object.entries(data.store.usedCharacters).forEach(([cardId, entry]) => {
          set(GLOBAL_USED_SUSPECTS, cardId, true);

          const answers = entry as BooleanDictionary[];
          const newAnswers = answers.reduce((acc, entry) => {
            return {
              ...acc,
              ...entry,
            };
          }, {});
          const previouslySavedCharacter = DATA_SUSPECT_ANSWERS?.[cardId] ?? {};
          set(DATA_SUSPECT_ANSWERS, cardId, { ...previouslySavedCharacter, ...newAnswers });
          Object.keys(newAnswers).forEach((questionId) => {
            set(GLOBAL_USED_TESTIMONY_QUESTIONS, questionId, true);
          });
        });
      }
    },
  });
}

/**
 * Testemunha ocular
 * - save used questions
 * - save used suspects
 * - save data suspect-questions
 */
export function parseTestemunhaOcular(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStateKeys: ['outcome', 'groupScore', 'perpetrator'],
    onRunIncomplete: (data) => {
      if (data.store.pastQuestions) {
        data.store.pastQuestions.forEach((entry: PlainObject) => {
          set(GLOBAL_USED_TESTIMONY_QUESTIONS, entry.id, true);
          if (entry.unfit) {
            entry.unfit.forEach((suspectId: CardId) => {
              set(GLOBAL_USED_SUSPECTS, suspectId, true);
              const previouslySavedCharacter = DATA_SUSPECT_ANSWERS?.[suspectId] ?? {};
              set(DATA_SUSPECT_ANSWERS, suspectId, { ...previouslySavedCharacter, [entry.id]: false });
            });
          }
        });
      }
    },
  });
}

/**
 * Ue So isso
 * - save used single words
 */
export function parseUeSoIsso(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStateKeys: ['group'],
  });
}

/**
 * Vamos Ao Cinema
 * -
 */
export function parseVamosAoCinema(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStoreKeys: ['badReviewsDeck', 'goodReviewsDeck', 'movieDeck'],
    keepStateKeys: ['finalMovies', 'groupScore'],
    onRunBeforeStore: (data) => {
      if (data.store.badReviewsDeck) {
        data.store.badReviewsDeck.forEach((review: PlainObject) => {
          set(GLOBAL_USED_MOVIES_AND_REVIEWS, review.id, true);
        });
      }

      if (data.store.goodReviewsDeck) {
        data.store.goodReviewsDeck.forEach((review: PlainObject) => {
          set(GLOBAL_USED_MOVIES_AND_REVIEWS, review.id, true);
        });
      }

      if (data.store.movieDeck) {
        data.store.movieDeck.forEach((movie: PlainObject) => {
          set(GLOBAL_USED_MOVIES_AND_REVIEWS, movie.id, true);
        });
      }

      if (data.state.finalMovies) {
        data.state.finalMovies.forEach((movie: PlainObject) => {
          if (movie.posterId) {
            set(GLOBAL_USED_MOVIES_AND_REVIEWS, movie.posterId, true);
          }
        });
      }
    },
  });
}

/**
 * Vendaval de Palpite
 * -
 */
export function parseVendavalDePalpite(key: string, metas: Metas, games: PlainObject) {
  parser({
    key,
    metas,
    games,
    keepStateKeys: ['board', 'categories', 'outcome', 'secretWord'],
  });
}
