/**
 * Generator for types.d.ts file
 */

const { convertToPascalCase } = require('../utils.cjs');

/**
 * Generates the contents of types.d.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateTypes(metadata) {
  const { gameName, gameKey } = metadata;
  const pascalName = convertToPascalCase(gameName);

  return `import type { ${gameKey}_ACTIONS } from './constants';

/**
 * Game options for ${pascalName}
 */
export type ${pascalName}Options = {
  /**
   * Game-specific configuration options supplied when creating a session.
   */
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Resource data loaded from TDR resources
 */
export type ResourceData = {
  /**
   * Resource collections needed to initialize the game.
   */
  [key: string]: unknown;
};

/**
 * Game store persisting across phases
 */
export type ${pascalName}Store = DefaultStore<${pascalName}Options> & {
  /**
   * Additional server-side data retained between phases.
   */
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Game state for the current phase
 */
export type ${pascalName}State = DefaultState & {
  /**
   * Additional public state shared with players as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Initial state structure for new game sessions
 */
export type ${pascalName}InitialState = InitialState & {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ${pascalName}Store;
  /**
   * The game-specific public state initialized for the session.
   */
  state: ${pascalName}State;
};

/**
 * Player action submission payload
 */
export type ${pascalName}SubmitAction = Payload & {
  /**
   * Identifier of the player action to validate and route to its handler.
   */
  action: keyof typeof ${gameKey}_ACTIONS;
};

/**
 * Firebase-compatible state type
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & ${pascalName}State;

/**
 * Firebase-compatible store type
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ${pascalName}Store;
`;
}

module.exports = {
  generateTypes,
};
