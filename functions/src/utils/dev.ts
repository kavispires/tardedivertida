// Internal
import { isDevelopmentEnvironment } from './environment';

/**
 * Development utility functions for debugging and testing
 *
 * Provides tools for development and debugging including:
 * - Console logging (print)
 * - Execution delays (devSimulateWait, forceWait)
 */

/**
 * Prints content to console in formatted JSON when running in development mode
 *
 * Only outputs when NODE_ENV is 'development'. Useful for debugging
 * during local development without cluttering production logs.
 *
 * @param content - The content to print to console (will be JSON stringified)
 * @example
 * print({ userId: '123', action: 'submit' }) // Logs formatted JSON in dev only
 */
export const print = (content: unknown) => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.log(JSON.stringify(content, null, 2));
  }
};

/**
 * Simulates a delay during development for testing loading states and async behavior
 *
 * Only delays when running in development environment. In production, this function
 * returns immediately without any delay.
 *
 * @param duration - The delay duration in milliseconds (default: 3000)
 * @example
 * await devSimulateWait(2000) // Waits 2 seconds in dev, instant in production
 */
export const devSimulateWait = async (duration = 3000) => {
  if (isDevelopmentEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};
