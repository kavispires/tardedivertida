// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../utils/constants';
// Utils
import utils from '../utils';
import aliemItemsMock from '../utils/mocks/alien-items.json';

/**
 * Feeds basic data to the emulator DB
 */
export const feedEmulatorDB = async () => {
  const sample = { 'a-a-a': true };
  console.log('\x1b[33m%s\x1b[0m', 'Populating Emulator DB');

  // DATA
  await utils.firebase.getDataRef().doc(DATA_DOCUMENTS.CONTENDERS_GLYPHS).set(sample);
  await utils.firebase.getDataRef().doc(DATA_DOCUMENTS.ALIEN_ITEMS).set(aliemItemsMock);

  // GLOBAL
  await utils.firebase.getGlobalRef().doc(USED_GAME_IDS).set(sample);

  // PUBLIC
  await utils.firebase.getPublicRef().doc('arteRuimDrawingsPt').set(sample);
  await utils.firebase.getPublicRef().doc('arteRuimDrawingsPt2').set(sample);
  await utils.firebase.getPublicRef().doc('arteRuimDrawingsEn').set(sample);
  await utils.firebase.getPublicRef().doc('arteRuimDrawingsEn2').set(sample);
  await utils.firebase.getPublicRef().doc('ratings').set(sample);

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    utils.firebase.getGlobalRef().doc(usedEntryName).set(sample)
  );

  await Promise.all(usedEntries);
};
