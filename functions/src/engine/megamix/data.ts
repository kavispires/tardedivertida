// Constants
import { GAME_NAMES, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData, Task } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { WINNING_CONDITION } from './constants';
import { getCandidatePersonality, parseCrimeTiles } from './helpers';

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

  // if (tasks.includes())
  const tasks: Task[] = [];

  // Get 6 different Image decks
  const imageCardsDecks = await utils.imageCards.getImageCardsDecks(5);

  // Get full deck
  const words = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.SINGLE_WORDS}-${language}`));

  // ARTE_RUIM
  // Get level 4 cards
  const cardsGroups: ArteRuimGroup[] = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.ARTE_RUIM_GROUPS}-${language}`)
  );
  const [arteGroup1, arteGroup2] = utils.game.getRandomItems(cardsGroups, 2);
  // 1 drawing for 3 cards
  tasks.push({
    game: GAME_NAMES.ARTE_RUIM,
    condition: WINNING_CONDITION.MOST_VOTED,
    variant: 'cards',
    data: {
      cards: utils.game
        .getRandomItems(Object.entries(arteGroup1.cards), 3)
        .reduce((acc: TextCard[], [id, text]) => {
          acc.push({
            id,
            text,
          });
          return acc;
        }, []),
    },
  });
  // 3 drawings for 1 cards
  tasks.push({
    game: GAME_NAMES.ARTE_RUIM,
    condition: WINNING_CONDITION.MOST_VOTED,
    variant: 'drawings',
    data: {
      cards: utils.game
        .getRandomItems(Object.entries(arteGroup2.cards), 3)
        .reduce((acc: TextCard[], [id, text]) => {
          acc.push({
            id,
            text,
          });
          return acc;
        }, []),
    },
  });

  // CONTADORES_HISTORIAS (1 card)
  tasks.push({
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      cardId: utils.game.getRandomItem(imageCardsDecks[0]),
    },
  });

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

  // CRUZA_PALAVRAS
  tasks.push({
    game: GAME_NAMES.CRUZA_PALAVRAS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(words, 4),
      clue: utils.game.getRandomItem(words),
    },
  });

  // DETETIVES_IMAGINATIVOS (3 cards)
  tasks.push({
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(imageCardsDecks[1], 3),
    },
  });

  // ESPIAO_ENTRE_NOS
  const spyLocations = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_LOCATIONS}-${language}`)
  );
  const spyQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_QUESTIONS}-${language}`)
  );
  const location = utils.game.getRandomItem(spyLocations) as SpyLocation;
  tasks.push({
    game: GAME_NAMES.ESPIAO_ENTRE_NOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      location: location,
      question: utils.game.getRandomItem(spyQuestions),
      roleIndex: utils.game.getRandomNumber(0, location.roles.length - 1),
    },
  });

  // GALERIA_DOS_SONHOS (3 cards)
  const themes = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_1}-${language}`));
  tasks.push({
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      cards: utils.game.getRandomItems(imageCardsDecks[2], 3),
      theme: utils.game.getRandomItem(themes),
    },
  });

  // MENTE_COLETIVA
  const groupQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.GROUP_QUESTIONS}-${language}`)
  );
  tasks.push({
    game: GAME_NAMES.MENTE_COLETIVA,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      question: utils.game.getRandomItem(groupQuestions),
    },
  });

  // NA_RUA_DO_MEDO
  // ????

  // ONDA_TELEPATICA
  const opposingIdeas = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.OPPOSING_IDEAS}-${language}`)
  );
  tasks.push({
    game: GAME_NAMES.ONDA_TELEPATICA,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      card: utils.game.getRandomItem(opposingIdeas),
    },
  });

  // POLEMICA_DA_VEZ
  const topics = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.TOPICS}-${language}`)
  ).filter((topic) => !(topic as Topic).custom);
  tasks.push({
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      card: utils.game.getRandomItem(topics),
    },
  });

  // PORTAS_DOS_PESADELOS (4 cards/doors + 1 card/book)
  tasks.push({
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      doors: utils.game.getRandomItems(imageCardsDecks[3], 3),
      book: utils.game.getRandomItem(imageCardsDecks[4]),
    },
  });

  // RETRATO_FALADO
  const monsters = Object.values(await resourceUtils.fetchTDIData('md/cards'));
  tasks.push({
    game: GAME_NAMES.RETRATO_FALADO,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      card: utils.game.getRandomItem(monsters),
    },
  });

  // SUPER_CAMPEONATO
  const contenders = (
    Object.values(await resourceUtils.fetchResource(TDR_RESOURCES.CONTENDERS)) as ContenderCard[]
  ).filter((c) => !c.exclusivity || c.exclusivity === language);
  const challenges = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.CHALLENGES}-${language}`)
  );
  tasks.push({
    game: GAME_NAMES.SUPER_CAMPEONATO,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      contenders: utils.game.getRandomItems(contenders, 2),
      challenge: utils.game.getRandomItem(challenges),
    },
  });

  // TESTEMUNHA_OCULAR
  const testimonyQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`)
  );
  const suspects = Object.values(await resourceUtils.fetchTDIData('us/info'));
  tasks.push({
    game: GAME_NAMES.TESTEMUNHA_OCULAR,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      question: utils.game.getRandomItem(testimonyQuestions),
      suspects: utils.game.getRandomItems(suspects, 3),
      answer: Boolean(utils.game.getRandomItem([true, false])),
    },
  });

  // UE_SO_ISSO
  tasks.push({
    game: GAME_NAMES.UE_SO_ISSO,
    condition: WINNING_CONDITION.STRING_MATCH,
    data: {
      card: utils.game.getRandomItem(words),
    },
  });

  // New games
  // DILEMA_DOS_ESQUIADORES
  const dilemmas = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.DILEMMAS}-${language}`));
  tasks.push({
    game: GAME_NAMES.DILEMA_DOS_ESQUIADORES,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      dilemma: utils.game.getRandomItem(dilemmas),
    },
  });

  // QUEM_NAO_MATA
  tasks.push({
    game: GAME_NAMES.QUEM_NAO_MATA,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {},
  });

  // FILEIRA_DE_FATOS
  const quantitativeQuestions = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.QUANTITATIVE_QUESTIONS}-${language}`)
  ).filter((topic) => (topic as QuantitativeQuestionCard).scale);
  tasks.push({
    game: GAME_NAMES.FILEIRA_DE_FATOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      card: utils.game.getRandomItem(quantitativeQuestions),
    },
  });

  // NAMORO_OU_AMIZADE
  const heads = Object.values(await resourceUtils.fetchTDIData('dates/heads'));
  const bodies = Object.values(await resourceUtils.fetchTDIData('dates/bodies'));
  const candidatePersonalities: DatingCandidateCard[] = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.DATING_CANDIDATE}-${language}`)
  );
  const selectedPersonalities = getCandidatePersonality(candidatePersonalities);
  tasks.push({
    game: GAME_NAMES.NAMORO_OU_AMIZADE,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      heads: utils.game.getRandomItems(heads, 3),
      bodies: utils.game.getRandomItems(bodies, 3),
      ...selectedPersonalities,
    },
  });

  // CAMINHOS_MAGICOS
  const portals = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_3}-${language}`));
  const adjectives = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.ADJECTIVES}-${language}`)
  );

  tasks.push({
    game: GAME_NAMES.CAMINHOS_MAGICOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      portals: utils.game.getRandomItems(portals, 3),
      adjectives: utils.game.getRandomItems(adjectives, 9),
    },
  });

  // PALHETA_DE_CORES
  const characters = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.CHARACTERS}-${language}`)
  );
  tasks.push({
    game: GAME_NAMES.PALHETA_DE_CORES,
    condition: WINNING_CONDITION.MOST_VOTED,
    data: {
      card: utils.game.getRandomItem(characters),
      palette: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'hotPink', 'gray', 'black', 'white'],
    },
  });

  // Get full deck
  return {
    tasks,
  };
};
