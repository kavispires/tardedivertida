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
  // TODO: Define options structure
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Resource data loaded from TDR resources
 */
export type ResourceData = {
  // TODO: Define resource structure
  [key: string]: unknown;
};

/**
 * Game store persisting across phases
 */
export interface ${pascalName}Store extends DefaultStore<${pascalName}Options> {
  // TODO: Add game-specific store properties
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Game state for the current phase
 */
export interface ${pascalName}State extends DefaultState {
  // TODO: Add game-specific state properties
 [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Initial state structure for new game sessions
 */
export interface ${pascalName}InitialState extends InitialState {
  store: ${pascalName}Store;
  state: ${pascalName}State;
}

/**
 * Player action submission payload
 */
export interface ${pascalName}SubmitAction extends Payload {
  action: keyof typeof ${gameKey}_ACTIONS;
}

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
