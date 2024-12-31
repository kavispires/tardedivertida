// Constants
import { DATA_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { FinalGalleryEntry, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { TextCard } from '../../types/tdr';
import * as globalUtils from '../global';

/**
 * Retrieves the warning sign cards for a given language.
 *
 * @param language - The language code for the desired language.
 * @returns A promise that resolves to an object containing all the warning sign descriptions and subjects.
 */
export const getCards = async (language: string): Promise<ResourceData> => {
  const descriptorsName = `${TDR_RESOURCES.WARNING_SIGNS_DESCRIPTORS}-${language}`;
  const allDescriptors = await resourceUtils.fetchResource<TextCard>(descriptorsName);

  const subjectsName = `${TDR_RESOURCES.WARNING_SIGNS_SUBJECTS}-${language}`;
  const allSubjects = await resourceUtils.fetchResource<TextCard>(subjectsName);

  return { allDescriptors: Object.values(allDescriptors), allSubjects: Object.values(allSubjects) };
};

/**
 * Saves the drawings to the specified document in Firebase.
 *
 * @param finalGallery - The array of final gallery entries to be saved.
 * @param language - The language used to determine the document name.
 * @returns A promise that resolves when the drawings are successfully saved.
 */
export const saveDrawings = async (finalGallery: FinalGalleryEntry[], language: Language): Promise<void> => {
  const docName = `${DATA_DOCUMENTS.SIGNS}${language.toUpperCase()}`;

  try {
    globalUtils.updateGlobalFirebaseDoc(docName, finalGallery);
  } catch (e) {
    // Ignore
  }
};
