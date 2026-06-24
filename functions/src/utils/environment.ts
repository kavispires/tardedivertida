/**
 * Checks if Firebase Functions are running in emulation mode
 * @returns True if running in Functions emulator
 */
export const isEmulatingFunctions = () => !!process.env.FUNCTIONS_EMULATOR;

/**
 * Checks if Firestore is running in emulation mode
 * @returns True if running in Firestore emulator
 */
export const isEmulatingFirestore = () => !!process.env.FIRESTORE_EMULATOR_HOST;

/**
 * Checks if either Functions or Firestore are running in emulation mode
 * @returns True if running in any emulation environment
 */
export const isEmulatingEnvironment = () => isEmulatingFunctions() || isEmulatingFirestore();

if (isEmulatingFunctions()) {
  // biome-ignore lint/suspicious/noConsole: on purpose used only during development
  console.log('🤡 EMULATING FUNCTIONS:', process.env.FUNCTIONS_EMULATOR);
}
if (isEmulatingFirestore()) {
  // biome-ignore lint/suspicious/noConsole: on purpose used only during development
  console.log('🤡 EMULATING FIRESTORE:', process.env.FIRESTORE_EMULATOR_HOST);
}
