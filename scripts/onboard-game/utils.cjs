/**
 * Utility functions for game onboarding script
 */

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
  const regex = /^[A-Z_]+$/;
  return regex.test(phase);
}

/**
 * Validates action name format
 * @param {string} action - Action name to validate
 * @returns {boolean} True if valid
 */
function validateActionName(action) {
  const regex = /^[A-Z_]+$/;
  return regex.test(action);
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
