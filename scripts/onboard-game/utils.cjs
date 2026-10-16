/**
 * Utility functions for game onboarding script
 */

const ts = require('typescript');
const CONSTANT_NAME_PATTERN = /^[A-Z]+(?:_[A-Z]+)*$/;

/**
 * Finds a named collection initializer without depending on its export or assertion syntax.
 */
function getCollection(source, name, isCollection) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) !== name) continue;
      let initializer = declaration.initializer;
      while (initializer && (
        ts.isAsExpression(initializer) ||
        ts.isSatisfiesExpression(initializer) ||
        ts.isParenthesizedExpression(initializer)
      )) {
        initializer = initializer.expression;
      }
      if (initializer && isCollection(initializer)) return initializer;
    }
  }
  throw new Error(`Could not find ${name} collection`);
}

/**
 * Reads a registry property's literal name or computed constant key.
 */
function getPropertyKey(property) {
  const name = property.name;
  if (name && (ts.isIdentifier(name) || ts.isStringLiteral(name))) return name.text;
  if (name && ts.isComputedPropertyName(name) && ts.isPropertyAccessExpression(name.expression)) {
    return name.expression.name.text;
  }
  throw new Error('Unsupported registry property');
}

/**
 * Inserts an entry while retaining existing collection entries, comments, and surrounding source.
 */
function insertCollectionEntry(content, entries, entry, before) {
  const position = before ? before.getFullStart() : entries.end;
  const comma = !before && entries.length && !entries.hasTrailingComma ? ',' : '';
  const newline = /^\s*\n/.test(content.slice(position)) ? '' : '\n';
  return content.slice(0, position) + `${comma}\n  ${entry},${newline}` + content.slice(position);
}

/**
 * Adds a game definition to the backend registry without rewriting existing definitions.
 */
function addGameDefinition(content, gameName, gameCode) {
  const source = ts.createSourceFile('games.ts', content, ts.ScriptTarget.Latest, true);
  const games = getCollection(source, 'GAMES', ts.isArrayLiteralExpression);
  const names = games.elements.map(element => {
    if (!ts.isObjectLiteralExpression(element)) throw new Error('Unsupported GAMES entry');
    const name = element.properties.find(property => getPropertyKey(property) === 'name');
    if (!name || !ts.isPropertyAssignment(name) || !ts.isStringLiteral(name.initializer)) {
      throw new Error('Game definition is missing a literal name');
    }
    return name.initializer.text;
  });
  if (names.includes(gameName)) throw new Error(`Game '${gameName}' already exists in GAMES`);
  const index = names.findIndex(name => name.localeCompare(gameName) > 0);
  const entry = `{\n    name: '${gameName}',\n    code: '${gameCode}',\n    key: '${convertNameToKey(gameName)}',\n  }`;
  return insertCollectionEntry(content, games.elements, entry, games.elements[index]);
}

/**
 * Adds a missing object-registry entry without altering existing registrations.
 */
function addRegistryEntry(content, registryName, key, entry) {
  const source = ts.createSourceFile('registry.ts', content, ts.ScriptTarget.Latest, true);
  const registry = getCollection(source, registryName, ts.isObjectLiteralExpression);
  const keys = registry.properties.map(getPropertyKey);
  if (keys.includes(key)) return content;
  const index = keys.findIndex(name => name !== '_TEMPLATE' && name.localeCompare(key) > 0);
  return insertCollectionEntry(content, registry.properties, entry, registry.properties[index]);
}

/**
 * Reads the keys of an object constant used by generated phase and action references.
 */
function getRegistryKeys(content, name) {
  const source = ts.createSourceFile('constants.ts', content, ts.ScriptTarget.Latest, true);
  return getCollection(source, name, ts.isObjectLiteralExpression).properties.map(getPropertyKey);
}

/**
 * Converts game name to UPPER_SNAKE_CASE constant key
 * @param {string} name - Game name (e.g., "arte-ruim")
 * @returns {string} Constant key (e.g., "ARTE_RUIM")
 */
function convertNameToKey(name) {
  return name.toUpperCase().replace(/-/g, '_');
}

/**
 * Converts game name to camelCase
 * @param {string} name - Game name (e.g., "arte-ruim")
 * @returns {string} CamelCase name (e.g., "arteRuim")
 */
function convertToCamelCase(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Converts game name to PascalCase
 * @param {string} name - Game name (e.g., "arte-ruim")
 * @returns {string} PascalCase name (e.g., "ArteRuim")
 */
function convertToPascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Converts action name to camelCase handler function name
 * @param {string} action - Action name (e.g., "SUBMIT_CARD")
 * @returns {string} Handler function name (e.g., "handleSubmitCard")
 */
function actionToHandlerName(action) {
  // Remove SUBMIT_ prefix if present
  const withoutSubmit = action.replace(/^SUBMIT_/, '');
  // Convert to camelCase
  const parts = withoutSubmit.split('_');
  const camelCase = parts
    .map((part, index) => {
      if (index === 0) {
        return part.toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
  return `handle${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
}

/**
 * Converts action name to property name
 * @param {string} action - Action name (e.g., "SUBMIT_CARD")
 * @returns {string} Property name (e.g., "card")
 */
function actionToPropName(action) {
  // Remove SUBMIT_ prefix if present
  const withoutSubmit = action.replace(/^SUBMIT_/, '');
  return withoutSubmit.toLowerCase().replace(/_/g, '');
}

/**
 * Converts action name to readable description
 * @param {string} action - Action name (e.g., "SUBMIT_CARD")
 * @returns {string} Description (e.g., "card submission")
 */
function actionToDescription(action) {
  const propName = actionToPropName(action);
  return `${propName} submission`;
}

/**
 * Converts action name to lowercase readable text
 * @param {string} action - Action name (e.g., "SUBMIT_CARD")
 * @returns {string} Lowercase text (e.g., "card")
 */
function actionToActionText(action) {
  return actionToPropName(action);
}

/**
 * Validates game name format
 * @param {string} name - Game name to validate
 * @returns {boolean} True if valid
 */
function validateGameName(name) {
  const regex = /^[a-z]+(-[a-z]+)*$/;
  return regex.test(name);
}

/**
 * Validates game code format
 * @param {string} code - Game code to validate
 * @returns {boolean} True if valid
 */
function validateGameCode(code) {
  const regex = /^[A-Z]$/;
  return regex.test(code);
}

/**
 * Validates phase name format
 * @param {string} phase - Phase name to validate
 * @returns {boolean} True if valid
 */
function validatePhaseName(phase) {
  return CONSTANT_NAME_PATTERN.test(phase);
}

/**
 * Validates action name format and the generated payload parameter
 * @param {string} action - Action name to validate
 * @returns {boolean} True if valid
 */
function validateActionName(action) {
  if (!CONSTANT_NAME_PATTERN.test(action)) return false;
  const parameter = actionToPropName(action);
  const token = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, parameter).scan();
  const isReservedWord = token >= ts.SyntaxKind.FirstKeyword && token <= ts.SyntaxKind.LastFutureReservedWord;
  return !isReservedWord && !['await', 'eval', 'arguments', 'action'].includes(parameter);
}

/**
 * Converts phase name to PascalCase for function names
 * @param {string} phase - Phase name (e.g., "CARD_PLAY")
 * @returns {string} PascalCase name (e.g., "CardPlay")
 */
function phaseToPascalCase(phase) {
  const parts = phase.split('_');
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Converts phase name to camelCase for function names
 * @param {string} phase - Phase name (e.g., "CARD_PLAY")
 * @returns {string} CamelCase name (e.g., "cardPlay")
 */
function phaseToCamelCase(phase) {
  const pascal = phaseToPascalCase(phase);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

module.exports = {
  addGameDefinition,
  addRegistryEntry,
  getRegistryKeys,
  convertNameToKey,
  convertToCamelCase,
  convertToPascalCase,
  actionToHandlerName,
  actionToPropName,
  actionToDescription,
  actionToActionText,
  validateGameName,
  validateGameCode,
  validatePhaseName,
  validateActionName,
  phaseToPascalCase,
  phaseToCamelCase,
};
