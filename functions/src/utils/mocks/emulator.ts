// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../constants';
// Utils
import utils from '..';
import aliemItemsMock from './alien-items.json';

/**
 * Feeds basic data to the emulator DB
 */
export const feedEmulatorDB = async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('\x1b[33m%s\x1b[0m', 'Skipping Emulator seeding: Not Emulating Firestore');
    return;
  }

  const sample = { 'a-a-a': true };
  console.log('\x1b[33m%s\x1b[0m', 'Seeding Emulator DB');

  // DATA
  const dataEntries = Object.values(DATA_DOCUMENTS).map((usedEntryName) =>
    utils.firebase.getDataRef().doc(usedEntryName).set(sample)
  );
  await Promise.all(dataEntries);
  await utils.firebase
    .getDataRef()
    .doc(DATA_DOCUMENTS.SUFFIX_COUNTS)
    .set({ drawings: 0, monsterDrawings: 0 });
  await utils.firebase.getDataRef().doc(DATA_DOCUMENTS.ALIEN_ITEMS).set(aliemItemsMock);

  // GLOBAL
  await utils.firebase.getGlobalRef().doc(USED_GAME_IDS).set(sample);

  // PUBLIC
  await utils.firebase.getPublicRef().doc('ratings').set(sample);

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    utils.firebase.getGlobalRef().doc(usedEntryName).set(sample)
  );
  await Promise.all(usedEntries);
};

export const feedEmulatorUser = async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('\x1b[33m%s\x1b[0m', 'Skipping Emulator seeding: Not Emulating Firestore');
    return;
  }

  console.log('\x1b[33m%s\x1b[0m', 'Seeding Emulator User');

  // USERS
  const emulateUid = utils.firebase.config().emulator_admin_uid;
  const emulateUser = utils.firebase.config().user_sample;
  await utils.firebase.getUserRef().doc(emulateUid).set(JSON.parse(emulateUser));
};
