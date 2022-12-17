// Constants
import { GAME_NAMES, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData, Task } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { WINNING_CONDITION } from './constants';
import { parseCrimeTiles } from './helpers';

/**
 * Get question cards resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string): Promise<ResourceData> => {
  // const tasks = getTaskList(includeAllMiniGameTypes, playAllGames);
  // const gameNames = tasks.reduce((acc: <Record, entry) => {
  //   acc.push(entry.game);
  //   return acc;
  // }, [])
  console.log(language);

  // if (tasks.includes())
  const tasks: Task[] = [];

  // Get 6 different Image decks
  const imageCardsDecks = await utils.imageCards.getImageCardsDecks(5);
  console.log('COMPLETE... GOT IMAGE_CARDS');

  // Get full deck
  const words = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.SINGLE_WORDS}-${language}`));
  console.log('COMPLETE... GOT SINGLE_WORDS');

  // ARTE_RUIM
  // TO-DO

  // CONTADORES_HISTORIAS (1 card)
  tasks.push({
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cardId: utils.game.getRandomItem(imageCardsDecks[0]),
    },
  });
  console.log('COMPLETE... GOT CONTADORES_HISTORIAS');

  // CRIMES_HEDIONDOS
  const allWeapons = await resourceUtils.fetchTDIData('dmhk/wp');
  const allEvidence = await resourceUtils.fetchTDIData('dmhk/ev');
  const allScenes = await resourceUtils.fetchResource(TDR_RESOURCES.CRIME_TILES);
  const crimes = parseCrimeTiles(allScenes);
  // Weapon Game
  tasks.push({
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    variant: 'weapon',
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(Object.values(allWeapons), 3),
      scenes: crimes.weapon.scenes,
      crimeIndexes: crimes.weapon.crime,
    },
  });
  // Object Game
  tasks.push({
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    variant: 'evidence',
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(Object.values(allEvidence), 3),
      scenes: crimes.evidence.scenes,
      crimeIndexes: crimes.evidence.crime,
    },
  });
  console.log('COMPLETE... GOT CRIMES_HEDIONDOS');

  // CRUZA_PALAVRAS
  tasks.push({
    game: GAME_NAMES.CRUZA_PALAVRAS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(words, 5),
    },
  });
  console.log('COMPLETE... GOT CRUZA_PALAVRAS');

  // DETETIVES_IMAGINATIVOS (3 cards)
  tasks.push({
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(imageCardsDecks[1], 3),
    },
  });
  console.log('COMPLETE... GOT DETETIVES_IMAGINATIVOS');

  // ESPIAO_ENTRE_NOS
  const spyLocations = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_LOCATIONS}-${language}`)
  );
  const spyQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_QUESTIONS}-${language}`)
  );
  const location = utils.game.getRandomItem(spyLocations) as SpyLocation;
  tasks.push({
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      location: location,
      question: utils.game.getRandomItem(spyQuestions),
      roleIndex: utils.game.getRandomNumber(0, location.roles.length - 1),
    },
  });
  console.log('COMPLETE... GOT ESPIAO_ENTRE_NOS');

  // GALERIA_DOS_SONHOS (3 cards)
  tasks.push({
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(imageCardsDecks[2], 3),
    },
  });
  console.log('COMPLETE... GOT GALERIA_DOS_SONHOS');

  // MENTE_COLETIVA

  // NA_RUA_DO_MEDO

  // ONDA_TELEPATICA

  // POLEMICA_DA_VEZ
  const topics = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.TOPICS}-${language}`));
  tasks.push({
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      cards: utils.game.getRandomItem(topics),
    },
  });
  console.log('COMPLETE... GOT POLEMICA_DA_VEZ');

  // PORTAS_DOS_PESADELOS (4 cards/doors + 1 card/book)
  tasks.push({
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      doors: utils.game.getRandomItems(imageCardsDecks[3], 3),
      book: utils.game.getRandomItem(imageCardsDecks[4]),
    },
  });
  console.log('COMPLETE... GOT PORTAS_DOS_PESADELOS');

  // SUPER_CAMPEONATO
  const contenders = (
    Object.values(await resourceUtils.fetchResource(TDR_RESOURCES.CONTENDERS)) as ContenderCard[]
  ).filter((c) => !c.exclusivity || c.exclusivity === language);
  const challenges = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.CHALLENGES}-${language}`)
  );
  tasks.push({
    game: GAME_NAMES.UE_SO_ISSO,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      contenders: utils.game.getRandomItems(contenders, 3),
      challenge: utils.game.getRandomItem(challenges),
    },
  });
  console.log('COMPLETE... GOT SUPER_CAMPEONATO');

  // TESTEMUNHA_OCULAR
  const testimonyQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`)
  );
  const suspects = Object.values(await resourceUtils.fetchTDIData('us/info'));
  tasks.push({
    game: GAME_NAMES.UE_SO_ISSO,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      question: utils.game.getRandomItem(testimonyQuestions),
      suspects: utils.game.getRandomItems(suspects, 3),
      answer: Boolean(utils.game.getRandomItem([true, false])),
    },
  });
  console.log('COMPLETE... GOT TESTEMUNHA_OCULAR');

  // UE_SO_ISSO
  tasks.push({
    game: GAME_NAMES.UE_SO_ISSO,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      cards: utils.game.getRandomItem(words),
    },
  });
  console.log('COMPLETE... GOT UE_SO_ISSO');

  // Get full deck
  return {
    tasks: utils.game.shuffle(tasks),
  };
};
