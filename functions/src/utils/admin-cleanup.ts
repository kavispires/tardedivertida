// eslint-disable-next-line
import { getFirestore } from 'firebase-admin/firestore';
import { throwException } from './firebase';

/* eslint-disable no-console */

/**
 * Removes retired game data from all user profiles in Firestore.
 * Cleans up game entries, recalculates statistics, and updates user documents.
 *
 * @param gameNames - Array of game names to retire (e.g., ['trevo-da-sorte', 'sonhos-pesadelos'])
 * @returns Summary of the cleanup operation including counts
 */
export const retireGamesFromUsers = async (gameNames: string[]): Promise<RetireGamesResult> => {
  const db = getFirestore();
  const usersRef = db.collection('users');

  let processedUsers = 0;
  let updatedUsers = 0;
  let gamesRemoved = 0;
  const errors: string[] = [];

  try {
    // Get all users
    const usersSnapshot = await usersRef.get();

    console.log(`Starting cleanup for games: ${gameNames.join(', ')}`);
    console.log(`Processing ${usersSnapshot.size} users...`);

    // Process users in batches to avoid timeout
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (const userDoc of usersSnapshot.docs) {
      processedUsers++;
      const userData = userDoc.data();
      let userModified = false;

      // Check if user has games data
      if (!userData.games || typeof userData.games !== 'object') {
        continue;
      }

      // Create a copy of games data without retired games
      const updatedGames = { ...userData.games };
      let userGamesRemoved = 0;

      for (const gameName of gameNames) {
        if (updatedGames[gameName]) {
          delete updatedGames[gameName];
          userGamesRemoved++;
          gamesRemoved++;
          userModified = true;
        }
      }

      // If user had retired games, update their document
      if (userModified) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {
          games: updatedGames,
        };

        // Check and update statistics fields that might reference retired games
        if (userData.statistics && typeof userData.statistics === 'object') {
          const stats = { ...userData.statistics };
          let statsModified = false;

          // Check mostPlayedGame
          if (stats.mostPlayedGame && gameNames.includes(stats.mostPlayedGame)) {
            stats.mostPlayedGame = null;
            statsModified = true;
          }

          // Check bestAtGame
          if (stats.bestAtGame && gameNames.includes(stats.bestAtGame)) {
            stats.bestAtGame = null;
            statsModified = true;
          }

          // Check favoriteGame
          if (stats.favoriteGame && gameNames.includes(stats.favoriteGame)) {
            stats.favoriteGame = null;
            statsModified = true;
          }

          // Check worstAtGame
          if (stats.worstAtGame && gameNames.includes(stats.worstAtGame)) {
            stats.worstAtGame = null;
            statsModified = true;
          }

          if (statsModified) {
            updates.statistics = stats;
          }
        }

        batch.update(userDoc.ref, updates);
        batchCount++;
        updatedUsers++;

        console.log(
          `User ${userDoc.id}: Removed ${userGamesRemoved} game(s) - ${gameNames.filter((g) => userData.games[g]).join(', ')}`,
        );

        // Commit batch when it reaches the size limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          batchCount = 0;
          console.log(`Committed batch of ${BATCH_SIZE} updates`);
        }
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }

    const result: RetireGamesResult = {
      success: true,
      processedUsers,
      updatedUsers,
      gamesRemoved,
      retiredGames: gameNames,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Cleanup completed successfully:');
    console.log(`- Processed ${processedUsers} users`);
    console.log(`- Updated ${updatedUsers} users`);
    console.log(`- Removed ${gamesRemoved} game entries`);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error during cleanup:', errorMessage);
    throwException(errorMessage, 'retireGamesFromUsers');
    return {
      success: false,
      processedUsers,
      updatedUsers,
      gamesRemoved,
      retiredGames: gameNames,
      errors: [errorMessage],
    };
  }
};

/**
 * Result of retiring games from user profiles
 */
export type RetireGamesResult = {
  /**
   * Whether the operation completed successfully
   */
  success: boolean;
  /**
   * Total number of users processed
   */
  processedUsers: number;
  /**
   * Number of users that were updated
   */
  updatedUsers: number;
  /**
   * Total number of game entries removed
   */
  gamesRemoved: number;
  /**
   * List of game names that were retired
   */
  retiredGames: string[];
  /**
   * List of errors encountered (if any)
   */
  errors?: string[];
};
