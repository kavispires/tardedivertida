// Constants
import { GAME_PROCESS_PHASES, LETTERS } from '../constants/general';

/**
 * Determines the next phase in the game flow based on the current phase.
 * If the current phase is not found in the ordered list, defaults to the first phase.
 * Special handling for 'LOBBY' phase which always advances to the first game phase.
 * @param currentPhase - The current phase of the game
 * @param orderedPhases - Array of phases in sequential order
 * @returns The next phase in the sequence
 */
export const nextPhaseDelegator = (currentPhase: string, orderedPhases: string[]): string => {
  const currentPhaseIndex = orderedPhases.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return orderedPhases[currentPhaseIndex + 1];
  }

  if (currentPhase === GAME_PROCESS_PHASES.LOBBY) {
    return orderedPhases[0];
  }

  // biome-ignore lint/suspicious/noConsole: on purpose
  console.warn(`⚠️ Missing phase check to follow ${currentPhase}`);
  return orderedPhases[0];
};

/**
 * Generates a unique game ID with the specified game code prefix and language identifier.
 * Format: [gameCode][languageLetter][randomLetters]
 * Example: 'ABCD' where A is game code, B is language letter, CD are random
 * @param gameCode - A single capital letter identifying the game
 * @param language - The game language ('en' or 'pt')
 * @param usedIds - Array of already-used IDs to avoid duplicates
 * @param length - The total length of the game ID
 * @returns A unique game ID string
 */
export const generateGameId = (
  gameCode: UID,
  language: Language,
  usedIds: string[] = [],
  length = 4,
): string => {
  if (!gameCode) throw Error('Missing game code');

  if (gameCode.length > 1 || !LETTERS.includes(gameCode)) throw Error('Invalid game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: UID, length: number, language: Language): string {
    let id = `${gameCode}`;

    const LETTERS_SAMPLE =
      language === 'en'
        ? LETTERS.slice(0, LETTERS.length / 2)
        : LETTERS.slice(LETTERS.length / 2, LETTERS.length);

    // Add second character based on language
    id +=
      language === 'en'
        ? LETTERS_SAMPLE[Math.floor(Math.random() * LETTERS_SAMPLE.length)]
        : LETTERS_SAMPLE[Math.floor(Math.random() * LETTERS_SAMPLE.length)];

    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || usedIds.includes(gameId)) {
    gameId = generateId(gameCode, length, language);
  }

  return gameId;
};

/**
 * Builds the default initial state structure for a game.
 * This provides the foundational meta, store, and state objects that all games extend.
 * @param params - Object containing game initialization parameters
 * @returns The complete initial state object for the game
 */
export function getDefaultInitialState<T = InitialState>({
  gameId,
  gameName,
  uid,
  language,
  version,
  playerCounts,
  totalRounds,
  store,
  options = {},
  onCreate = () => ({}),
}: InitialStateArgs): InitialState | T {
  const createdAt = Date.now();
  const preSetupResult = onCreate();
  return {
    meta: {
      gameId,
      gameName,
      createdAt,
      createdBy: uid,
      min: playerCounts.MIN,
      max: playerCounts.MAX,
      isLocked: false,
      isComplete: false,
      language,
      replay: 0,
      options,
      version,
      ...(preSetupResult?.meta ?? {}),
    },
    store: {
      language,
      options,
      createdAt,
      ...store,
      ...(preSetupResult?.store ?? {}),
    },
    state: {
      phase: GAME_PROCESS_PHASES.LOBBY,
      round: {
        current: 0,
        total: totalRounds,
        forceLastRound: false,
      },
      updatedAt: Date.now(),
      ...(preSetupResult?.state ?? {}),
      players: {
        ...(preSetupResult?.players ?? {}),
      },
    },
  };
}
