// Internal
import { isDevelopmentEnvironment } from './environment';

type PrintArguments = unknown[];

const log = (...content: PrintArguments): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.log(...content);
  }
};

const debug = (...content: PrintArguments): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.debug(...content);
  }
};

const info = (...content: PrintArguments): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.info(...content);
  }
};

const warn = (...content: PrintArguments): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.warn(...content);
  }
};

const error = (...content: PrintArguments): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.error(...content);
  }
};

const table = (tabularData?: unknown, properties?: string[]): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.table(tabularData, properties);
  }
};

const count = (label?: string): void => {
  if (isDevelopmentEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Intentional console usage for development debugging
    console.count(label);
  }
};

/**
 * Development utility functions for debugging and testing
 *
 * Provides tools for development and debugging including:
 * - Console logging (print)
 * - Execution delays (devSimulateWait, forceWait)
 */

/**
 * Prints content to the console when running in development mode
 *
 * Only outputs when NODE_ENV is 'development'. Useful for debugging
 * during local development without cluttering production logs.
 *
 * Use the attached methods to select a console level, such as `print.debug()`
 * or `print.warn()`. Calling `print()` directly is equivalent to `print.log()`.
 *
 * @example
 * print({ userId: '123', action: 'submit' })
 * print.debug('Current state', state)
 * print.warn('Unexpected value', value)
 */
export const print = Object.assign(log, {
  count,
  debug,
  error,
  info,
  log,
  table,
  warn,
});

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
