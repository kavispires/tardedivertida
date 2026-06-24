// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../constants';
// Utils
import alienItemsMock from './alien-items.json';
import type { FirebaseUserDB } from '../user';
import { isDevelopmentEnvironment, isEmulatingFirestore } from '../environment';
import {
  getDailyCollectionRef,
  getDataCollectionRef,
  getGlobalCollectionRef,
  getPublicCollectionRef,
  getUserCollectionRef,
} from '../../services/firestore-core';

const sample = {};

/**
 * Feeds basic data to the emulator DB
 */
export const feedEmulatorDB = async () => {
  if (!isEmulatingFirestore()) {
    // Only log if it's development environment, otherwise it will be too noisy in production
    if (isDevelopmentEnvironment()) {
      console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
    }
    return;
  }

  console.log('\x1b[33m%s\x1b[0m', '🤡 Seeding Emulator DB');

  // DATA
  const dataEntries: Promise<FirebaseFirestore.WriteResult>[] = [];

  Object.values(DATA_DOCUMENTS).forEach((usedEntryName) => {
    dataEntries.push(getDataCollectionRef().doc(usedEntryName).set(sample));

    dataEntries.push(getDataCollectionRef().doc(`${usedEntryName}PT`).set(sample));
    dataEntries.push(getDataCollectionRef().doc(`${usedEntryName}EN`).set(sample));
  });

  await Promise.all(dataEntries);
  await getDataCollectionRef().doc(DATA_DOCUMENTS.SUFFIX_COUNTS).set({ drawings: 0, monsterDrawings: 0 });
  await getDataCollectionRef().doc(DATA_DOCUMENTS.ALIEN_ITEMS).set(alienItemsMock);

  // GLOBAL
  await getGlobalCollectionRef().doc(USED_GAME_IDS).set(sample);

  // PUBLIC
  await getPublicCollectionRef().doc('ratings').set(sample);

  // DAILY
  await getPublicCollectionRef().doc('daily').set({ '2023-10-31': true });
  await getPublicCollectionRef().doc('diario').set({ '2023-10-31': true });

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    getGlobalCollectionRef().doc(usedEntryName).set(sample),
  );
  await Promise.all(usedEntries);
};

/**
 * Feeds user data to the emulator DB for testing
 */
export const feedEmulatorUser = async () => {
  if (!isEmulatingFirestore()) {
    // Only log if it's development environment, otherwise it will be too noisy in production
    if (isDevelopmentEnvironment()) {
      console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
    }
    return;
  }

  console.log('\x1b[33m%s\x1b[0m', '🤡 Seeding Emulator User');

  // USERS
  const emulateUid = process.env.EMULATOR_ADMIN_UID ?? 'emulate-uid';

  const emulateUser: FirebaseUserDB = {
    avatars: {
      0: 43,
    },
    blurredImages: {},
    games: {},
    gender: 'unknown',
    id: emulateUid,
    names: ['KavDev'],
    isAdmin: true,
    preferredLanguage: 'pt',
    ratings: {},
  };

  await getUserCollectionRef().doc(emulateUid).set(emulateUser);
};

/**
 * Feeds daily challenge data to the emulator DB for testing
 */
export const feedEmulatorDaily = async () => {
  if (!isEmulatingFirestore()) {
    // Only log if it's development environment, otherwise it will be too noisy in production
    if (isDevelopmentEnvironment()) {
      console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
    }
    return;
  }

  const dataEntries: Promise<FirebaseFirestore.WriteResult>[] = [];

  Object.values(DATA_DOCUMENTS).forEach((usedEntryName) => {
    dataEntries.push(getDataCollectionRef().doc(usedEntryName).set(sample));

    dataEntries.push(getDataCollectionRef().doc(`${usedEntryName}PT`).set(sample));
    dataEntries.push(getDataCollectionRef().doc(`${usedEntryName}EN`).set(sample));
  });

  await Promise.all(dataEntries);

  console.log('\x1b[33m%s\x1b[0m', '🤡 Seeding Emulator Daily');

  // DAILY
  const dailyMock = {
    'arte-ruim': JSON.parse(
      '{"cardId":"ap-10-pt--0--11","drawings":["[[201,141,201,141,200,140,200,134,198,114,196,103,195,95,194,93,194,92,194,91,194,91,193,89,192,87,191,83,189,78,188,73,187,73,187,72,186,72,186,72,185,73,183,74,181,74,180,75,179,75,179,76,178,77,177,84,176,90,175,96,174,107,173,115,173,121,172,124,172,124,171,124,171,124,169,125,168,125,166,125,163,125,159,125,156,125,151,126,148,126,146,127,144,127,143,127,142,127,142,127,141,128,141,128,141,128,140,129,140,130,140,132,142,139,143,142,144,143,145,144,145,145,146,146,146,146,146,147,146,147,146,147,144,148,141,151,139,152,134,155,133,156,132,156,132,156,131,156,131,156,129,156,128,157,127,157,127,157,127,157,125,158,125,159,123,160,121,161,120,161,120,162,119,162,118,163,117,163,117,164,117,164,117,164,117,164,117,165,116,166,117,166,118,166,118,167,120,167,121,168,124,169,127,170,133,171,142,172,147,172,149,173,150,173,150,173,150,172,151,171,152,171,152,170,153,170,154,169,154,169,155,170,157,171,160,175,163,184,166,194,170,213,171,217,173,232,173,248,173,264,173,280,173,294,174,301,174,307,175,316,175,321,175,326,175,333,175,344,175,351,175,357,175,359,175,359,175,360,175,364,175,370,175,373,175,376,175,377,175,378,177,382,180,389,182,393,183,394,185,395,185,393,187,386,191,375,197,354,203,336,209,323,211,317,213,315,213,314,214,312,214,310,214,310,216,314,222,328,228,346,234,362,238,371,239,372,239,371,239,370,239,370,240,370,240,369,240,367,243,357,247,343,251,327,255,314,256,310,257,308,257,307,257,306,257,306,259,300,260,299,260,300,263,308,268,321,275,332,282,339,286,341,291,341,293,340,295,340,295,340,296,340,297,340,297,340,299,340,303,340,307,339,309,339,313,339,318,341,319,341,320,341,320,341,320,341,320,344,320,351,320,363,320,380,319,392,318,402,318,412,318,415,318,416,318,416,318,415,318,415,319,414,321,404,322,392,324,379,326,364,328,356,331,346,332,341,333,337,334,336,334,336,334,336,336,338,337,339,340,342,344,349,348,356,356,370,364,379,367,382,367,382,367,381,368,379,368,369,368,357,368,347,369,342,369,338,369,333,369,322,369,306,369,290,368,273,368,270,368,262,368,255,368,251,367,248,366,247,366,247,365,246,363,243,359,239,354,234,348,228,340,223,332,221,328,221,324,221,319,222,315,225,310,227,304,228,298,228,289,223,275,213,265,204,256,197,248,191,239,186,234,181,228,174,220,164,216,158,213,152,211,148,209,144,209,141,208,141,208,140,208.1,140.1],[83,167,82,167,80,166,79,165,78,165,78,165,77,165,76,164,74,164,73,164,69,163,68,163,68,163,68,163,67,163,67,163,66,163,66,163,66,164,66,164,66,164,65,164,65,165,64,165,63,166,63,166,62,166,62,166,62,166,62,166,62,167,63,167,63,167,64,167,64,167,64,167,65,168,66,168,66,168,67,169,67,169,68,169,68,169,68,169,70,169,70,169,71,169,71,169,71,169,72,169,73,168,75,168,76,167,77,167,79,166,79,166,80,166,80,166,81,166,81.1,166.1],[163,138,164,138,164,138,164,138,164,139,164,139,164,140,165,141,166,142,166,143,167,144,167,144,168,144,168,144,169,144,169,144,170,144,170,144,171,144,173,143,174,143,174,142,175,142,175,142,175,141,175,141,175,140,175,140,175,139,175,139,175.1,139.1],[59,181,58,181,57,182,53,183,47,185,41,185,38,186,37,186,37,186,36,186,36,187,36,187,36,187,36,187,37,188,40,191,41,192,41,192,42,192,43,192,44,192,45,191,46,191,46,191,46,191,47,188,47,187,48,186,49,186,49,185,50,185,52,183,54,182,57,181,59,180,60,180,60,180]]","[[143,160,144,165,145,174,145,179,145,183,145,188,145,193,145,194,145,198,145,200,145,201,145,207,145,211,145,212,146,217,147,222,147,225,147,228,148,231,148,234,149,235,150,239,150,242,151,245,154,251,156,256,158,260,160,263,166,267,169,267,171,267,175,267,178,267,180,267,185,265,186,265,189,265,191,263,193,263,200,261,203,260,206,260,207,259,212,259,215,259,219,259,224,259,229,259,233,259,238,259,245,259,251,259,253,262,265,263,273,263,278,264,282,264,284,265,285,265,287,265,291,266,294,268,300,269,311,271,320,272,330,273,340,277,344,277,352,279,358,280,362,280,369,281,375,284,377,285,378,286,379,287,381,289,382,292,383,297,386,303,386,307,386,311,386,315,386,319,386,322,386,324,386,327,385,331,385,333,382,340,380,343,379,347,378,350,377,351,377,352,376,353,373,354,366,354,364,355,355,357,346,359,342,361,341,362,340,365,339,368,338,370,338,375,338,377,338,380,338,384,338,387,338,390,338,392,338,396,335,405,335,409,335,412,335,417,335,418,334,420,333,420,332,421,328,422,324,422,319,422,314,422,310,420,308,417,308,411,308,405,309,398,310,394,313,390,315,384,316,381,317,375,319,371,319,364,320,358,320,350,319,343,317,338,316,336,314,335,313,333,312,333,311,333,307,333,304,333,296,333,286,333,280,334,276,334,273,335,272,335,271,337,267,341,266,343,262,349,262,352,258,361,256,368,255,372,255,376,254,382,254,385,253,387,253,389,253,390,252,393,251,394,249,396,247,398,242,400,235,402,233,403,226,405,223,405,221,405,220,405,219,405,218,405,216,403,213,396,210,390,210,388,208,381,207,375,206,371,206,363,206,358,206,356,206,351,206,347,206,345,206,344,206,342,206,341,206,339,206,338,206,337,206,335,206,333,204,331,196,331,191,331,185,331,179,331,177,331,172,331,170,331,166,331,164,331,163,331,161,331,160,331,158,331,157,331,149,326,144,324,140,321,135,318,132,315,129,313,126,312,124,310,122,309,122,308,121,307,119,304,115,300,112,293,110,288,108,282,107,280,107,278,106,276,106,274,106,272,106,268,106,265,106,260,106,255,106,249,106,241,106,235,106,233,106,230,106,227,106,226,106,224,106,222,106,220,106,218,106,216,106,214,106,210,106,209,106,206,104,203,103,200,102,198,102,196,102,194,101,190,101,188,100,186,100,185,99,183,98,181,98,180,97,180,97,179,95,179,94,179,89,179,85,179,79,178,78,178,77,178,76,175,73,174,70,172,69,169,67,168,67,166,66,164,65,162,65,160,64,158,64,157,64,155,63,153,63,152,63,150,63,146,64,146,65,146,66,145,69,144,72,144,78,143,85,141,89,141,99,141,104,140,107,140,110,140,111,140,112,140,116,140,117,140,119,140,124,141,125,142,127,142,129,142,130,142,131,142,132,142,133,142,134,143,136,143,136,144,137,145,138,146,139,147,140,148,142,149,143,151,143,152,144,153,144,155,145,157,146,159,146,160,146.1,160.1]]"],"id":"2023-10-31","type":"arte-ruim","language":"pt","number":0,"text":"Lhama cuspideira"}',
    ),
    'aqui-o': JSON.parse(
      '{"id":"2023-10-31","type":"aqui-o","number":0,"setId":"special","title":{"pt":"Especial","en":"Special"},"itemsIds":["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25"]}',
    ),
    // 4 letters
    palavreado: JSON.parse(
      '{"id":"2023-10-31","type":"palavreado","number":0,"keyword":"paio","words":["pelé","vaca","ônix","foro"],"letters":["p","a","r","ô","x","a","e","é","f","c","i","n","v","o","l","o"],"scoringWords":["afro","alvo","anil","arco","café","cair","calo","cana","cano","cara","caro","cavo","ceia","colo","coro","cria","faca","face","fala","falo","faro","fava","favo","feia","feio","feno","foco","fria","frio","lava","naca","naco","nave","nexo","novo","pane","pano","peco","pelo","pena","pera","proa","prol","raio","ralé","ralo","rolo","roxo","vala","vale","valo","vara","veia","veio","vero"]}',
    ),
    /// 5 letters
    // palavreado: JSON.parse(
    //   '{"id":"2025-09-20","type":"palavreado","number":498,"keyword":"praça","words":["pente","úrico","adaga","suíço","malha"],"letters":["p","o","l","a","m","s","r","n","u","h","a","e","a","c","í","t","a","i","ç","d","e","o","ú","g","a"]}',
    // ),
    picaco: {
      id: '2023-10-31',
      type: 'picaco',
      number: 0,
      cards: Array(12)
        .fill(0)
        .map((_, i) => ({
          id: `a-${i}-pt`,
          level: 1,
          text: `Texto ${i}`,
        })),
    },
    filmaco: JSON.parse(
      '{"id":"2023-10-31","number":0,"type":"filmaco","setId":"dms-5-pt","title":"007 - O Espião que era sexy pra cacete","itemsIds":["763","1971","1988"],"year":1977}',
    ),
    // filmaco: JSON.parse(
    //   '{"id":"2023-10-31","number":0,"type":"filmaco","setId":"dms-5-pt","title":"007 - O Espião que era sexy pra cacete × Olha quem está olhando","itemsIds":["763","1971","1988", "2", "2187"],"year":"1977 × 2014", "isDoubleFeature": true}',
    // ),
    estoquista: JSON.parse(
      '{"number":0,"goods":["good-1","good-2","good-3","good-4","good-5","good-6","good-7","good-8","good-9","good-10","good-11","good-12","good-13","good-14","good-15","good-16"],"language":"pt","orders":["good-1","good-2","good-3","good-4","good-17"],"id":"2023-10-31","type":"estoquista","title":"Demo-feira"}',
    ),
    conjuntos: JSON.parse(
      '{"id":"2023-10-31","type":"conjuntos","number":0,"title":"Contagem vs Gramática","level":1,"rule1":{"id":"ddr-46-pt","text":"é monossílaba","level":1,"thing":{"id":"37","name":"spray"}},"rule2":{"id":"ddr-37-pt","text":"tem acento","level":1,"thing":{"id":"812","name":"balão"}},"intersectingThing":{"id":"1381","name":"pó"},"things":[{"id":"2439","name":"noz","rule":1},{"id":"1256","name":"cronômetro","rule":2},{"id":"1897","name":"pé","rule":0},{"id":"550","name":"trem","rule":1},{"id":"1364","name":"chalé","rule":2},{"id":"328","name":"gol","rule":1},{"id":"1153","name":"fax","rule":1},{"id":"234","name":"ladrão","rule":2},{"id":"2340","name":"coiso","rule":2},{"id":"3118","name":"pum","rule":1}]}',
    ),
    alienado: JSON.parse(
      '{"id":"2023-10-31","setId":"big-con-odo","number":0,"type":"alienado","attributes":[{"id":"odo","name":"Cheiro","description":"cheiro, odor, aroma","spriteId":"31","itemsIds":["2548","2613","95"]},{"id":"con","name":"Construção","description":"construção, estrutura, arquitetura, housing","spriteId":"29","itemsIds":["1805","1561"]},{"id":"big","name":"Grande","description":"tamanho, magnitude","spriteId":"25","itemsIds":["106","116","51"]}],"requests":[{"spritesIds":["29","25"],"itemId":"1577"},{"spritesIds":["31","25"],"itemId":"46"},{"spritesIds":["31","29","25"],"itemId":"1824"},{"spritesIds":["31","29"],"itemId":"893"}],"solution":"1577-46-1824-893","itemsIds":["1577","893","1824","185","46","2626","2633"],"valid":true}',
    ),
    // investigacao: JSON.parse(
    //   '{"id":"2023-10-31","type":"investigacao","number":1,"isNsfw":false,"culpritId":"us-003","statements":[{"key":"testimony.t-12-pt","text":"O(a) suspeito(a) nunca foi no parque Guanabara (parque de diversões local)","excludes":["us-017"],"type":"testimony"},{"key":"not.feature.orangeClothes","text":"O(a) suspeito(a) não está vestindo roupas laranjas","excludes":["us-011","us-016","us-017","us-026"],"type":"feature"},{"key":"testimony.t-24-pt","text":"O(a) suspeito(a) não faz trabalho voluntário","excludes":["us-006","us-021","us-020","us-108","us-011","us-016","us-005","us-090","us-010","us-026"],"type":"testimony"},{"key":"not.feature.showTeeth","text":"O(a) suspeito(a) não está mostrando os dentes","excludes":["us-006","us-021","us-108","us-005","us-090","us-026"],"type":"feature"},{"key":"not.grid.column3","text":"O(a) suspeito(a) não está na terceira coluna","excludes":["us-017","us-005","us-010"],"type":"grid"},{"key":"not.feature.large","text":"O(a) suspeito(a) não é gordo(a)","excludes":["us-021","us-020","us-017","us-026"],"type":"feature"}],"additionalStatements":[{"key":"not.feature.brownHair","text":"O(a) suspeito(a) não tem cabelo castanho","excludes":["us-108","us-011","us-010","us-017"],"type":"feature"},{"key":"not.grid.row3","text":"O(a) suspeito(a) não está na terceira linha","excludes":["us-021","us-011","us-010","us-026"],"type":"grid"}],"suspects":[{"id":"us-003","name":{"en":"Cameron","pt":"Conrado"},"gender":"male","features":["male","adult","white","medium","average"]},{"id":"us-006","name":{"en":"Fredrick","pt":"Frederico"},"gender":"male","features":["male","adult","white","tall","muscular","showTeeth"]},{"id":"us-017","name":{"en":"Flick","pt":"Fagner"},"gender":"male","features":["male","adult","brown","medium","large","brownHair","orangeClothes"]},{"id":"us-020","name":{"en":"Tonya","pt":"Tânia"},"gender":"female","features":["female","senior","white","short","large"]},{"id":"us-016","name":{"en":"Prisca","pt":"Priscila"},"gender":"female","features":["female","adult","brown","short","thin","orangeClothes"]},{"id":"us-090","name":{"en":"Kathleen","pt":"Kelly"},"gender":"female","features":["female","adult","white","tall","average","showTeeth"]},{"id":"us-005","name":{"en":"Jesse","pt":"Jéferson"},"gender":"male","features":["male","young","white","medium","average","showTeeth"]},{"id":"us-108","name":{"en":"Clayton","pt":"Cleiton"},"gender":"male","features":["male","adult","brown","tall","average","brownHair","showTeeth"]},{"id":"us-021","name":{"en":"Una","pt":"Úrsula"},"gender":"female","features":["female","adult","brown","short","large","showTeeth"]},{"id":"us-011","name":{"en":"Norton","pt":"Nelson"},"gender":"male","features":["male","adult","white","tall","average","brownHair","orangeClothes"]},{"id":"us-010","name":{"en":"Levi","pt":"Levi"},"gender":"male","features":["male","senior","white","tall","average","brownHair"]},{"id":"us-026","name":{"en":"Coach","pt":"Adamastor"},"gender":"male","features":["male","senior","white","medium","large","showTeeth","orangeClothes"]}],"reason":{"en":"Sold haunted house tours in places that weren\'t haunted... until now.","pt":"Vendeu passeios por casas assombradas que não eram assombradas... até agora."},"setId":"us-003::cr-115::testimony.t-12-pt","level":3}',
    // ),
    // investigacao weekend
    investigacao: JSON.parse(
      '{"id":"2026-05-28","type":"investigacao","number":328,"isNsfw":true,"culpritId":"us-097","statements":[{"key":"testimony.t-97-pt","text":"O(a) suspeito(a) tem antecedentes criminais","excludes":["us-120","us-127","us-151","us-067","us-038","us-051","us-099","us-020"],"type":"testimony"},{"key":"not.feature.necklace","text":"O(a) suspeito(a) não está usando um colar","excludes":["us-120","us-099","us-020","us-142","us-047"],"type":"feature"},{"key":"testimony.t-130-pt","text":"O(a) suspeito(a) nunca ficou em pânico por conta de um teste de gravidez","excludes":["us-151","us-142"],"type":"testimony"},{"key":"not.feature.shortHair","text":"O(a) suspeito(a) não tem cabelo curto","excludes":["us-151","us-067","us-038","us-099"],"type":"feature"},{"key":"testimony.t-136-pt","text":"O(a) suspeito(a) não participaria do Big Brother","excludes":["us-120","us-151","us-099","us-142","us-132","us-047"],"type":"testimony"},{"key":"not.feature.longHair","text":"O(a) suspeito(a) não tem cabelo longo","excludes":["us-120","us-051","us-142","us-047"],"type":"feature"}],"additionalStatements":[{"key":"not.grid.corners","text":"O(a) suspeito(a) não está nos cantos","excludes":["us-051","us-038","us-020","us-067"],"type":"grid"},{"key":"not.grid.column1","text":"O(a) suspeito(a) não está na primeira coluna","excludes":["us-051","us-120","us-020"],"type":"grid"},{"key":"not.grid.row1","text":"O(a) suspeito(a) não está na primeira linha","excludes":["us-051","us-127","us-142","us-038"],"type":"grid"}],"suspects":[{"id":"us-051","name":{"en":"Edgard","pt":"Edgar"},"gender":"male","features":["male","adult","white","tall","thin","longHair"]},{"id":"us-127","name":{"en":"Letitia","pt":"Letícia"},"gender":"female","features":["female","adult","black","tall","thin","bald"]},{"id":"us-142","name":{"en":"Salma","pt":"Suellen"},"gender":"female","features":["female","adult","black","short","average","longHair","necklace"]},{"id":"us-038","name":{"en":"Lia","pt":"Lia"},"gender":"female","features":["female","adult","asian","short","large","shortHair"]},{"id":"us-120","name":{"en":"Lisa","pt":"Lisa"},"gender":"female","features":["female","young","asian","short","thin","longHair","necklace"]},{"id":"us-047","name":{"en":"Barry","pt":"Bartolomeu"},"gender":"male","features":["male","adult","white","tall","large","necklace","longHair"]},{"id":"us-097","name":{"en":"Paxton","pt":"Péricles"},"gender":"male","features":["male","adult","white","medium","average","bald"]},{"id":"us-099","name":{"en":"Vanessa","pt":"Valesca"},"gender":"female","features":["female","adult","black","medium","muscular","shortHair","necklace"]},{"id":"us-020","name":{"en":"Tonya","pt":"Tânia"},"gender":"female","features":["female","senior","white","short","large","necklace","mediumHair"]},{"id":"us-151","name":{"en":"Darius","pt":"Dario"},"gender":"male","features":["male","adult","black","tall","muscular","shortHair"]},{"id":"us-132","name":{"en":"Hugh","pt":"Humberto"},"gender":"male","features":["male","adult","white","tall","muscular","mediumHair","bald"]},{"id":"us-067","name":{"en":"Walter","pt":"Walter"},"gender":"male","features":["male","senior","white","medium","large","shortHair"]}],"reason":{"en":"Held a press conference to deny crimes no one knew about yet.","pt":"Fez uma coletiva de imprensa para negar crimes que ninguém sabia ainda."},"setId":"us-097::cr-109::testimony.t-97-pt","level":2}',
    ),
    'ta-na-cara': JSON.parse(
      '{"id":"2023-10-31","number":0,"type":"ta-na-cara","testimonies":[{"testimonyId":"t-1-pt","question":"Ele(a) já foi para um jogo em um estádio?","nsfw":false,"suspectsIds":["us-gb-031","us-gb-032","us-gb-033","us-gb-034","us-gb-035","us-gb-036"]},{"testimonyId":"t-2-pt","question":"Ele(a) gosta de música clássica?","nsfw":false,"suspectsIds":["us-gb-051","us-gb-052","us-gb-053","us-gb-054","us-gb-055","us-gb-056"]},{"testimonyId":"t-3-pt","question":"Ele(a) acredita em alienígenas?","nsfw":true,"suspectsIds":["us-gb-101","us-gb-102","us-gb-103","us-gb-104","us-gb-105","us-gb-106"]}],"variant":"rl","suspectsIds":["us-gb-001","us-gb-002","us-gb-003","us-gb-004","us-gb-005","us-gb-006","us-gb-007"],"names":{"us-gb-031":"Murilo","us-gb-032":"João","us-gb-033":"José","us-gb-036":"Conrado"}}',
    ),
    conexoes: JSON.parse(
      '{"id":"2026-04-04","type":"conexoes","number":1,"imageIds":["td-d2-130","td-d1-210","td-d16-81","td-d13-190","td-d1-149","td-d14-237","td-d5-186","td-d1-38","td-d16-211","td-d9-78","td-d16-187","td-d6-192","td-d3-69","td-d7-13","td-d1-42","td-d13-171","td-d9-198","td-d11-180","td-d14-73","td-d14-26","td-d9-94","td-d13-188","td-d11-156","td-d1-24","td-d7-93","td-d15-150","td-d15-207","td-d8-163","td-d3-51","td-d3-46","td-d2-28","td-d16-226","td-d2-107","td-d7-158","td-d8-230","td-d2-211","td-d2-212","td-d9-35","td-d12-132","td-d4-124","td-d11-252","td-d9-65","td-d14-172","td-d9-32","td-d6-209","td-d13-08","td-d10-53","td-d11-143","td-d9-126","td-d1-246"]}',
    ),
    quartetos: JSON.parse(
      '{"id":"2023-10-31","setId":"1","number":0,"type":"quartetos","difficulty":0,"grid":["483","2633","194","167","2601","632","179","2630","416","580","471","2746","27","190","1280","347"],"sets":[{"id":"27-167-179-580","title":"Duas rodas","itemsIds":["27","167","179","580"],"level":0},{"id":"1280-2601-2630-2633","title":"Animais Extintos","itemsIds":["1280","2601","2633","2630"],"level":1},{"id":"194-416-471-632","title":"Coisas que enchem de ar","itemsIds":["194","416","471","632"],"level":2},{"id":"190-347-483-2746","title":"Video Game","itemsIds":["190","2746","347","483"],"level":3}]}',
    ),
    portais: JSON.parse(
      '{"id":"2025-09-20","type":"portais","setId":"1e43c;;431df;;83406","number":162,"corridors":[{"passcode":"incêndio","imagesIds":["td-d12-52","td-d12-162","td-d12-220"],"words":["rio","nau","oco","ipê","zen","dar","piá","ovo"],"goal":8},{"passcode":"aprender","imagesIds":["td-d1-234","td-d3-26"],"words":["asa","top","par","mel","ano","dia","ela","rir"],"goal":10},{"passcode":"penumbra","imagesIds":["td-d1-48"],"words":["par","eca","nem","uso","tom","boi","grã","aia"],"goal":13}],"goal":31}',
    ),
    // 5 grid
    // organiku: JSON.parse(
    //   '{"id":"2023-10-31","number":0,"setId":"b5300","type":"organiku","title":"Aniversário","grid":["155","185","1187","718","159","185","1187","155","159","718","159","155","718","1187","185","1187","718","159","185","155","718","159","185","155","1187"],"defaultRevealedIndexes":[15,16,14,7,8,2,6],"itemsIds":["1187","718","185","155","159"]}',
    // ),
    // 6 grid
    organiku: JSON.parse(
      '{"id":"2023-10-31","number":0,"setId":"50896","type":"organiku","title":"Banheiro","grid":["3142","2107","289","2197","1784","602","289","3142","2197","1784","602","2107","2107","602","1784","289","3142","2197","1784","2197","2107","602","289","3142","2197","289","602","3142","2107","1784","602","1784","3142","2107","2197","289"],"defaultRevealedIndexes":[30,5,18,29,35,22,19,24,23,16,11,33,10,13],"itemsIds":["602","1784","289","2197","3142","2107"]}',
    ),
    vitral: JSON.parse(
      '{"id":"example","number":1,"type":"vitral","title":"Example Puzzle","cardId":"td-d5-208","pieces":[9,13,17,16,6,5,8,15,0,1,7,11,14,10,3,12,2,4]}',
    ),
    mapeamento: JSON.parse(
      '{"id":"2023-10-31","number":0,"type":"mapeamento","setId":"demo-set","language":"pt","location":"Reinô do Coçugmelo","clues":["Mundo colorido de canos","Habitado por pequenos Toads","Constantemente invadido por Bowser","Governado pela Princesa Peach","Onde Mario vive aventuras"]}',
    ),
    pirralhos: JSON.parse(
      '{"id":"2026-05-27","number":4,"type":"pirralhos","hashId":"NHwxfDJ8M3w3LDExNy04LTQtMix1cy1nYi0yMzM=","kids":[{"kidId":"us-gb-233","statement":{"en":"Someone shorter than 117 cm did it","pt":"Foi alguém menor que 117 cm"}},{"kidId":"us-gb-236","statement":{"en":"Someone next to me did it","pt":"Foi alguém do meu lado"}},{"kidId":"us-gb-240","statement":{"en":"A boy did it","pt":"Foi um menino"}},{"kidId":"us-gb-231","statement":{"en":"Dylan is lying","pt":"Daniel tá mentindo"}}],"culpritId":"us-gb-240","liarsIds":["us-gb-240","us-gb-231"],"possibleLiars":3,"difficulty":38}',
    ),
    dictionary: {
      0: 'td',
      1: 'tapete de ioga',
      2: 'coqueiro',
      3: 'espada',
      4: 'metralhadora',
      5: 'porco',
      6: 'envelope',
      7: 'caixa de ferramentas',
      8: 'chapeuzinho de festa',
      9: 'dentadura',
      10: 'carro',
      11: 'livro',
      12: 'robô',
      13: 'joia',
      14: 'morango',
      15: 'luvas de boxe',
      16: 'peixe',
      17: 'carrinho de supermercado',
      18: 'leque',
      19: 'pente',
      20: 'árvore de natal',
      21: 'pá',
      22: 'camisola',
      23: 'piano',
      24: 'sonho',
      25: 'pendrive',
    },
  };

  await getDailyCollectionRef('daily').doc('2023-10-31').set(dailyMock);

  await getDailyCollectionRef('diario').doc('2023-10-31').set(dailyMock);

  const history = {
    latestDate: '2023-10-31',
    latestNumber: 0,
    used: [],
  };
  await getDailyCollectionRef('daily').doc('history').set(history);
  await getDailyCollectionRef('diario').doc('history').set(history);

  // Suffix counts
  await getDailyCollectionRef('data').doc('suffixCounts').set({
    drawingsPT: 2,
    drawingsEN: 3,
  });

  await getDailyCollectionRef('data').doc('testimonies').set({});
};
