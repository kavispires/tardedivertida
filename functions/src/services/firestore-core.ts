// eslint-disable-next-line
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Get Firebase reference for the data collection used to save bot and seed data
 * @returns Reference to the data collection
 */
export function getDataCollectionRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('data');
}

/**
 * Get Firebase reference for the global collection containing cross-game data
 * @returns Reference to the global collection
 */
export function getGlobalCollectionRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('global');
}

/**
 * Get Firebase reference for the meta collection containing game metadata
 * @returns Reference to the meta collection
 */
export function getMetaCollectionRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('meta');
}

/**
 * Get Firebase reference for the public collection containing publicly accessible data
 * @returns Reference to the public collection
 */
export function getPublicCollectionRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('public');
}

/**
 * Get Firebase reference for the users collection containing user profiles and data
 * @returns Reference to the users collection
 */
export function getUserCollectionRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('users');
}

/**
 * Get Firebase reference for the daily games collection
 * @param documentName - The collection name ('daily' for English or 'diario' for Portuguese)
 * @returns Reference to the specified daily collection
 */
export function getDailyCollectionRef(
  documentName: string,
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection(documentName);
}

/**
 * Get Firebase reference for a specific game session
 * @param gameName - The name of the game
 * @param gameId - The unique identifier for the game session
 * @returns Reference to the game session collection
 */
export function getSessionRef(
  gameName: string,
  gameId: string,
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('games').doc(gameName).collection(gameId);
}

/**
 * Creates a Firestore sentinel value to delete a field from a document during an update operation
 * @returns Firestore delete sentinel
 */
export function deleteValue() {
  return FieldValue.delete();
}

/**
 * Creates a Firestore sentinel value to atomically increment a numeric field during an update operation
 * @param value - The amount to increment by (defaults to 1)
 * @returns Firestore increment sentinel
 */
export function incrementValue(value = 1) {
  return FieldValue.increment(value);
}

/**
 * Creates a Firestore sentinel value to add elements to an array field, avoiding duplicates
 * @param value - One or more values to add to the array
 * @returns Firestore arrayUnion sentinel
 */
export function pushValue(...value: unknown[]) {
  return FieldValue.arrayUnion(...value);
}

/**
 * Creates a Firestore sentinel value to remove elements from an array field
 * @param value - One or more values to remove from the array
 * @returns Firestore arrayRemove sentinel
 */
export function removeValue(...value: unknown[]) {
  return FieldValue.arrayRemove(...value);
}

/**
 * Creates a Firestore sentinel value for a server-side timestamp, ensuring synchronized timing across all clients
 * @returns Firestore serverTimestamp sentinel
 */
export function getServerTimestamp() {
  return FieldValue.serverTimestamp();
}
