// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../constants';
// Utils
import utils from '..';
import aliemItemsMock from './alien-items.json';
import type { FirebaseUserDB } from '../user';

/**
 * Feeds basic data to the emulator DB
 */
export const feedEmulatorDB = async () => {
  if (!utils.firebase.isEmulatingFirestore()) {
    console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
    return;
  }

  const sample = { 'a-a-a': true };
  console.log('\x1b[33m%s\x1b[0m', '🤡 Seeding Emulator DB');

  // DATA
  const dataEntries: Promise<FirebaseFirestore.WriteResult>[] = [];

  Object.values(DATA_DOCUMENTS).forEach((usedEntryName) => {
    dataEntries.push(utils.firestore.getDataRef().doc(usedEntryName).set(sample));

    dataEntries.push(utils.firestore.getDataRef().doc(`${usedEntryName}PT`).set(sample));
    dataEntries.push(utils.firestore.getDataRef().doc(`${usedEntryName}EN`).set(sample));
  });

  await Promise.all(dataEntries);
  await utils.firestore
    .getDataRef()
    .doc(DATA_DOCUMENTS.SUFFIX_COUNTS)
    .set({ drawings: 0, monsterDrawings: 0 });
  await utils.firestore.getDataRef().doc(DATA_DOCUMENTS.ALIEN_ITEMS).set(aliemItemsMock);

  // GLOBAL
  await utils.firestore.getGlobalRef().doc(USED_GAME_IDS).set(sample);

  // PUBLIC
  await utils.firestore.getPublicRef().doc('ratings').set(sample);

  // DAILY
  await utils.firestore.getPublicRef().doc('daily').set({ '2023-10-31': true });
  await utils.firestore.getPublicRef().doc('diario').set({ '2023-10-31': true });

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    utils.firestore.getGlobalRef().doc(usedEntryName).set(sample),
  );
  await Promise.all(usedEntries);
};

export const feedEmulatorUser = async () => {
  if (!utils.firebase.isEmulatingFirestore()) {
    console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
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

  await utils.firestore.getUserRef().doc(emulateUid).set(emulateUser);
};

export const feedEmulatorDaily = async () => {
  if (!utils.firebase.isEmulatingFirestore()) {
    console.log('\x1b[33m%s\x1b[0m', '📛 Skipping Emulator seeding: Not Emulating Firestore');
    return;
  }

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
      '{"id":"2023-10-31","number":0,"type":"palavreado","language":"pt","keyword":"cuba","letters":["c","i","b","m","l","u","e","a","h","r","b","l","ê","o","o","a"],"words":["calo","muro","bebê","ilha"]}',
    ),
    /// 5 letters
    // palavreado: JSON.parse(
    //   '{"id":"2025-09-20","type":"palavreado","number":498,"keyword":"praça","words":["pente","úrico","adaga","suíço","malha"],"letters":["p","o","l","a","m","s","r","n","u","h","a","e","a","c","í","t","a","i","ç","d","e","o","ú","g","a"]}',
    // ),
    artista: {
      id: '2023-10-31',
      type: 'artista',
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
    'controle-de-estoque': JSON.parse(
      '{"number":0,"goods":["good-1","good-2","good-3","good-4","good-5","good-6","good-7","good-8","good-9","good-10","good-11","good-12","good-13","good-14","good-15","good-16"],"language":"pt","orders":["good-1","good-2","good-3","good-4","good-17"],"id":"2023-10-31","type":"controle-de-estoque","title":"Demo-feira"}',
    ),
    'teoria-de-conjuntos': JSON.parse(
      '{"id":"2023-10-31","type":"teoria-de-conjuntos","number":0,"title":"Contagem vs Gramática","level":1,"rule1":{"id":"ddr-46-pt","text":"é monossílaba","level":1,"thing":{"id":"37","name":"spray"}},"rule2":{"id":"ddr-37-pt","text":"tem acento","level":1,"thing":{"id":"812","name":"balão"}},"intersectingThing":{"id":"1381","name":"pó"},"things":[{"id":"2439","name":"noz","rule":1},{"id":"1256","name":"cronômetro","rule":2},{"id":"1897","name":"pé","rule":0},{"id":"550","name":"trem","rule":1},{"id":"1364","name":"chalé","rule":2},{"id":"328","name":"gol","rule":1},{"id":"1153","name":"fax","rule":1},{"id":"234","name":"ladrão","rule":2},{"id":"2340","name":"coiso","rule":2},{"id":"3118","name":"pum","rule":1}]}',
    ),
    'comunicacao-alienigena': JSON.parse(
      '{"id":"2023-10-31","setId":"big-con-odo","number":0,"type":"comunicacao-alienigena","attributes":[{"id":"odo","name":"Cheiro","description":"cheiro, odor, aroma","spriteId":"31","itemsIds":["2548","2613","95"]},{"id":"con","name":"Construção","description":"construção, estrutura, arquitetura, housing","spriteId":"29","itemsIds":["1805","1561"]},{"id":"big","name":"Grande","description":"tamanho, magnitude","spriteId":"25","itemsIds":["106","116","51"]}],"requests":[{"spritesIds":["29","25"],"itemId":"1577"},{"spritesIds":["31","25"],"itemId":"46"},{"spritesIds":["31","29","25"],"itemId":"1824"},{"spritesIds":["31","29"],"itemId":"893"}],"solution":"1577-46-1824-893","itemsIds":["1577","893","1824","185","46","2626","2633"],"valid":true}',
    ),
    espionagem: JSON.parse(
      '{"id":"2023-10-31","type":"espionagem","number":1,"isNsfw":false,"culpritId":"us-03","statements":[{"key":"testimony.t-12-pt","text":"O(a) suspeito(a) nunca foi no parque Guanabara (parque de diversões local)","excludes":["us-17"],"type":"testimony"},{"key":"not.feature.orangeClothes","text":"O(a) suspeito(a) não está vestindo roupas laranjas","excludes":["us-11","us-16","us-17","us-26"],"type":"feature"},{"key":"testimony.t-24-pt","text":"O(a) suspeito(a) não faz trabalho voluntário","excludes":["us-06","us-21","us-20","us-108","us-11","us-16","us-05","us-90","us-10","us-26"],"type":"testimony"},{"key":"not.feature.showTeeth","text":"O(a) suspeito(a) não está mostrando os dentes","excludes":["us-06","us-21","us-108","us-05","us-90","us-26"],"type":"feature"},{"key":"not.grid.column3","text":"O(a) suspeito(a) não está na terceira coluna","excludes":["us-17","us-05","us-10"],"type":"grid"},{"key":"not.feature.large","text":"O(a) suspeito(a) não é gordo(a)","excludes":["us-21","us-20","us-17","us-26"],"type":"feature"}],"additionalStatements":[{"key":"not.feature.brownHair","text":"O(a) suspeito(a) não tem cabelo castanho","excludes":["us-108","us-11","us-10","us-17"],"type":"feature"},{"key":"not.grid.row3","text":"O(a) suspeito(a) não está na terceira linha","excludes":["us-21","us-11","us-10","us-26"],"type":"grid"}],"suspects":[{"id":"us-03","name":{"en":"Cameron","pt":"Conrado"},"gender":"male","features":["male","adult","white","medium","average"]},{"id":"us-06","name":{"en":"Fredrick","pt":"Frederico"},"gender":"male","features":["male","adult","white","tall","muscular","showTeeth"]},{"id":"us-17","name":{"en":"Flick","pt":"Fagner"},"gender":"male","features":["male","adult","brown","medium","large","brownHair","orangeClothes"]},{"id":"us-20","name":{"en":"Tonya","pt":"Tânia"},"gender":"female","features":["female","senior","white","short","large"]},{"id":"us-16","name":{"en":"Prisca","pt":"Priscila"},"gender":"female","features":["female","adult","brown","short","thin","orangeClothes"]},{"id":"us-90","name":{"en":"Kathleen","pt":"Kelly"},"gender":"female","features":["female","adult","white","tall","average","showTeeth"]},{"id":"us-05","name":{"en":"Jesse","pt":"Jéferson"},"gender":"male","features":["male","young","white","medium","average","showTeeth"]},{"id":"us-108","name":{"en":"Clayton","pt":"Cleiton"},"gender":"male","features":["male","adult","brown","tall","average","brownHair","showTeeth"]},{"id":"us-21","name":{"en":"Una","pt":"Úrsula"},"gender":"female","features":["female","adult","brown","short","large","showTeeth"]},{"id":"us-11","name":{"en":"Norton","pt":"Nelson"},"gender":"male","features":["male","adult","white","tall","average","brownHair","orangeClothes"]},{"id":"us-10","name":{"en":"Levi","pt":"Levi"},"gender":"male","features":["male","senior","white","tall","average","brownHair"]},{"id":"us-26","name":{"en":"Coach","pt":"Adamastor"},"gender":"male","features":["male","senior","white","medium","large","showTeeth","orangeClothes"]}],"reason":{"en":"Sold haunted house tours in places that weren\'t haunted... until now.","pt":"Vendeu passeios por casas assombradas que não eram assombradas... até agora."},"setId":"us-03::cr-115::testimony.t-12-pt","level":3}',
    ),
    'ta-na-cara': JSON.parse(
      '{"id":"2023-10-31","number":0,"type":"ta-na-cara","testimonies":[{"testimonyId":"t-1-pt","question":"Ele(a) já foi para um jogo em um estádio?","nsfw":false,"suspectsIds":["us-gb-31","us-gb-32","us-gb-33","us-gb-34","us-gb-35","us-gb-36"]},{"testimonyId":"t-2-pt","question":"Ele(a) gosta de música clássica?","nsfw":false,"suspectsIds":["us-gb-51","us-gb-52","us-gb-53","us-gb-54","us-gb-55","us-gb-56"]},{"testimonyId":"t-3-pt","question":"Ele(a) acredita em alienígenas?","nsfw":true,"suspectsIds":["us-gb-101","us-gb-102","us-gb-103","us-gb-104","us-gb-105","us-gb-106"]}],"variant":"rl","suspectsIds":["us-gb-01","us-gb-02","us-gb-03","us-gb-04","us-gb-05","us-gb-06","us-gb-07"],"names":{"us-gb-31":"Murilo","us-gb-32":"João","us-gb-33":"José","us-gb-36":"Conrado"}}',
    ),
    quartetos: JSON.parse(
      '{"id":"2023-10-31","setId":"1","number":0,"type":"quartetos","difficulty":0,"grid":["483","2633","194","167","2601","632","179","2630","416","580","471","2746","27","190","1280","347"],"sets":[{"id":"27-167-179-580","title":"Duas rodas","itemsIds":["27","167","179","580"],"level":0},{"id":"1280-2601-2630-2633","title":"Animais Extintos","itemsIds":["1280","2601","2633","2630"],"level":1},{"id":"194-416-471-632","title":"Coisas que enchem de ar","itemsIds":["194","416","471","632"],"level":2},{"id":"190-347-483-2746","title":"Video Game","itemsIds":["190","2746","347","483"],"level":3}]}',
    ),
    'portais-magicos': JSON.parse(
      '{"id":"2025-09-20","type":"portais-magicos","setId":"1e43c;;431df;;83406","number":162,"corridors":[{"passcode":"incêndio","imagesIds":["td-d12-52","td-d12-162","td-d12-220"],"words":["rio","nau","oco","ipê","zen","dar","piá","ovo"],"goal":8},{"passcode":"aprender","imagesIds":["td-d1-234","td-d3-26"],"words":["asa","top","par","mel","ano","dia","ela","rir"],"goal":10},{"passcode":"penumbra","imagesIds":["td-d1-48"],"words":["par","eca","nem","uso","tom","boi","grã","aia"],"goal":13}],"goal":31}',
    ),
    // 5 grid
    // organiku: JSON.parse(
    //   '{"id":"2023-10-31","number":0,"setId":"b5300","type":"organiku","title":"Aniversário","grid":["155","185","1187","718","159","185","1187","155","159","718","159","155","718","1187","185","1187","718","159","185","155","718","159","185","155","1187"],"defaultRevealedIndexes":[15,16,14,7,8,2,6],"itemsIds":["1187","718","185","155","159"]}',
    // ),
    // 6 grid
    organiku: JSON.parse(
      '{"id":"2023-10-31","number":0,"setId":"50896","type":"organiku","title":"Banheiro","grid":["3142","2107","289","2197","1784","602","289","3142","2197","1784","602","2107","2107","602","1784","289","3142","2197","1784","2197","2107","602","289","3142","2197","289","602","3142","2107","1784","602","1784","3142","2107","2197","289"],"defaultRevealedIndexes":[30,5,18,29,35,22,19,24,23,16,11,33,10,13],"itemsIds":["602","1784","289","2197","3142","2107"]}',
    ),
  };

  await utils.firestore.getDailyRef('daily').doc('2023-10-31').set(dailyMock);

  await utils.firestore.getDailyRef('diario').doc('2023-10-31').set(dailyMock);

  const history = {
    latestDate: '2023-10-31',
    latestNumber: 0,
    used: [],
  };
  await utils.firestore.getDailyRef('daily').doc('history').set(history);
  await utils.firestore.getDailyRef('diario').doc('history').set(history);

  // Suffix counts
  await utils.firestore.getDailyRef('data').doc('suffixCounts').set({
    drawingsPT: 2,
    drawingsEN: 3,
  });

  await utils.firestore.getDailyRef('data').doc('testimonies').set({});
};
