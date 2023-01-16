// Constants
import { GAME_NAMES, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { AvailableTask, MegamixGameOptions, ResourceData, Task } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { MINI_GAMES_LIST, TOTAL_ROUNDS, WINNING_CONDITION } from './constants';
import {
  getCandidatePersonality,
  getGameOnList,
  getMovieReviews,
  getNaRuaDoMedoScenario,
  parseCrimeTiles,
} from './helpers';

/**
 * Get question cards resource based on the game's language
 * @param language
 * @param options
 * @param playerCount
 * @returns
 */
export const getData = async (
  language: string,
  options: MegamixGameOptions,
  playerCount: number
): Promise<ResourceData> => {
  const tasks: Task[] = [];

  // Determine tasks and variants depending on options
  const listOfGames = utils.game
    .shuffle(
      MINI_GAMES_LIST.reduce((acc: AvailableTask[], entry) => {
        // When the game has variants, if not all games, randomly choose one variant
        if (entry.variants) {
          if (options.allMinigames) {
            entry.variants.forEach((variant) => {
              acc.push({
                game: entry.game,
                nsfw: entry.nsfw,
                upcoming: entry.upcoming,
                variant,
              });
            });
          } else {
            acc.push({
              game: entry.game,
              nsfw: entry.nsfw,
              upcoming: entry.upcoming,
              variant: utils.game.getRandomItem(entry.variants),
            });
          }
        } else {
          acc.push({
            game: entry.game,
            nsfw: entry.nsfw,
            upcoming: entry.upcoming,
          });
        }
        return acc;
      }, [])
    )
    .filter((minigame) => (options.nsfw ? true : !minigame.nsfw));

  const publishedMinigames = listOfGames.filter((minigame) => !minigame.upcoming);
  const upcomingMinigames = listOfGames.filter((minigame) => minigame.upcoming);

  const availableTasks = options.allMinigames
    ? listOfGames
    : [
        ...utils.game.getRandomItems(publishedMinigames, TOTAL_ROUNDS - 4),
        ...utils.game.getRandomItems(upcomingMinigames, 4),
      ];

  // GET IMAGE CARDS DECKS AND SINGLE WORD DECK
  const imageCardsDecks = await utils.imageCards.getImageCardsDecks(6, options.originalDecks);
  const words = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.SINGLE_WORDS}-${language}`));

  // ARTE_RUIM
  const hasArteRuim = getGameOnList(availableTasks, GAME_NAMES.ARTE_RUIM);
  if (hasArteRuim.length > 0) {
    // Get level 4 cards
    const cardsGroups: ArteRuimGroup[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.ARTE_RUIM_GROUPS}-${language}`)
    );
    const [arteGroup1, arteGroup2] = utils.game.getRandomItems(cardsGroups, 2);

    hasArteRuim.forEach((game) => {
      // VARIANT: CARDS
      if (game.variant === 'cards') {
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
      }

      // VARIANT: DRAWINGS
      if (game.variant === 'drawings') {
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
      }
    });
  }

  // CONTADORES_HISTORIAS (1 card)
  const hasContadoresHistorias = getGameOnList(availableTasks, GAME_NAMES.CONTADORES_HISTORIAS);
  if (hasContadoresHistorias.length > 0) {
    hasContadoresHistorias.forEach(() => {
      tasks.push({
        game: GAME_NAMES.CONTADORES_HISTORIAS,
        condition: WINNING_CONDITION.STRING_MATCH,
        data: {
          cardId: utils.game.getRandomItem(imageCardsDecks[0]),
        },
      });
    });
  }

  // CRIMES_HEDIONDOS
  const hasCrimesHediondos = getGameOnList(availableTasks, GAME_NAMES.CRIMES_HEDIONDOS);
  if (hasCrimesHediondos.length > 0) {
    const allWeapons = await resourceUtils.fetchTDIData('dmhk/wp');
    const allEvidence = await resourceUtils.fetchTDIData('dmhk/ev');
    const allScenes = await resourceUtils.fetchResource(TDR_RESOURCES.CRIME_TILES);
    const crimes = parseCrimeTiles(allScenes);

    hasCrimesHediondos.forEach((game) => {
      if (game.variant === 'weapon') {
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
      }

      if (game.variant === 'evidence') {
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
      }
    });
  }

  // CRUZA_PALAVRAS
  const hasCruzaPalavras = getGameOnList(availableTasks, GAME_NAMES.CRUZA_PALAVRAS);
  if (hasCruzaPalavras.length > 0) {
    hasCruzaPalavras.forEach(() => {
      tasks.push({
        game: GAME_NAMES.CRUZA_PALAVRAS,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          cards: utils.game.getRandomItems(words, 4),
          clue: utils.game.getRandomItem(words),
        },
      });
    });
  }

  // DETETIVES_IMAGINATIVOS (3 cards)
  const hasDetetivesImaginativos = getGameOnList(availableTasks, GAME_NAMES.DETETIVES_IMAGINATIVOS);
  if (hasDetetivesImaginativos.length > 0) {
    hasDetetivesImaginativos.forEach((game) => {
      // VARIANT: Impostor
      if (game.variant === 'detective') {
        tasks.push({
          game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'detective',
          data: {
            cards: utils.game.getRandomItems(imageCardsDecks[1], 4),
          },
        });
      }
      // VARIANT: Detective
      if (game.variant === 'impostor') {
        const selectedCards = utils.game.sliceInParts(utils.game.getRandomItems(imageCardsDecks[1], 6), 2);
        tasks.push({
          game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'impostor',
          data: {
            table: selectedCards[0],
            cards: selectedCards[1],
          },
        });
      }
    });
  }

  // ESPIAO_ENTRE_NOS
  const hasEspiaoEntreNos = getGameOnList(availableTasks, GAME_NAMES.ESPIAO_ENTRE_NOS);
  if (hasEspiaoEntreNos.length > 0) {
    const spyLocations = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_LOCATIONS}-${language}`)
    );
    const spyQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_QUESTIONS}-${language}`)
    );
    const location = utils.game.getRandomItem(spyLocations) as SpyLocation;
    hasEspiaoEntreNos.forEach(() => {
      tasks.push({
        game: GAME_NAMES.ESPIAO_ENTRE_NOS,
        condition: WINNING_CONDITION.STRING_MATCH,
        data: {
          location: location,
          question: utils.game.getRandomItem(spyQuestions),
          roleIndex: utils.game.getRandomNumber(0, location.roles.length - 1),
        },
      });
    });
  }

  // GALERIA_DOS_SONHOS (3 cards)
  const hasGaleriaDosSonhos = getGameOnList(availableTasks, GAME_NAMES.GALERIA_DE_SONHOS);
  if (hasGaleriaDosSonhos) {
    const themes = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_1}-${language}`));
    hasGaleriaDosSonhos.forEach(() => {
      tasks.push({
        game: GAME_NAMES.GALERIA_DE_SONHOS,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          cards: utils.game.getRandomItems(imageCardsDecks[2], 3),
          theme: utils.game.getRandomItem(themes),
        },
      });
    });
  }

  // MENTE_COLETIVA
  const hasMenteColetiva = getGameOnList(availableTasks, GAME_NAMES.MENTE_COLETIVA);
  if (hasMenteColetiva.length > 0) {
    const groupQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.GROUP_QUESTIONS}-${language}`)
    );
    hasMenteColetiva.forEach(() => {
      tasks.push({
        game: GAME_NAMES.MENTE_COLETIVA,
        condition: WINNING_CONDITION.STRING_MATCH,
        data: {
          question: utils.game.getRandomItem(groupQuestions),
        },
      });
    });
  }

  // NA_RUA_DO_MEDO
  const hasNaRuaDoMedo = getGameOnList(availableTasks, GAME_NAMES.NA_RUA_DO_MEDO);
  if (hasNaRuaDoMedo.length > 0) {
    const streetData = getNaRuaDoMedoScenario(playerCount);
    hasNaRuaDoMedo.forEach((game) => {
      // VARIANT: 'kids'
      if (game.variant === 'kids') {
        tasks.push({
          game: GAME_NAMES.NA_RUA_DO_MEDO,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'kids',
          data: {
            options: {
              0: streetData.scenarios[0],
              1: streetData.scenarios[1],
            },
            costumes: streetData.costumes,
          },
        });
      }
      // VARIANT: 'house'
      if (game.variant === 'house') {
        tasks.push({
          game: GAME_NAMES.NA_RUA_DO_MEDO,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'house',
          data: {
            options: streetData.home,
            kids: streetData.kids,
          },
        });
      }
    });
  }

  // ONDA_TELEPATICA
  const hasOndaTelepatica = getGameOnList(availableTasks, GAME_NAMES.ONDA_TELEPATICA);
  if (hasOndaTelepatica.length > 0) {
    const opposingIdeas = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.OPPOSING_IDEAS}-${language}`)
    );
    hasOndaTelepatica.forEach(() => {
      tasks.push({
        game: GAME_NAMES.ONDA_TELEPATICA,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          card: utils.game.getRandomItem(opposingIdeas),
        },
      });
    });
  }

  // POLEMICA_DA_VEZ
  const hasPolemicaDaVez = getGameOnList(availableTasks, GAME_NAMES.POLEMICA_DA_VEZ);
  if (hasPolemicaDaVez.length > 0) {
    const topics = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.TOPICS}-${language}`)
    ).filter((topic) => !(topic as Topic).custom);

    hasPolemicaDaVez.forEach(() => {
      tasks.push({
        game: GAME_NAMES.POLEMICA_DA_VEZ,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          card: utils.game.getRandomItem(topics),
        },
      });
    });
  }

  // PORTAS_DOS_PESADELOS (4 cards/doors + 1 card/book)
  const hasPortaDosDesesperados = getGameOnList(availableTasks, GAME_NAMES.PORTA_DOS_DESESPERADOS);
  if (hasPortaDosDesesperados.length > 0) {
    hasPortaDosDesesperados.forEach((game) => {
      if (game.variant === 'normal') {
        tasks.push({
          game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'normal',
          data: {
            doors: utils.game.getRandomItems(imageCardsDecks[3], 3),
            book: utils.game.getRandomItems(imageCardsDecks[4], 1),
          },
        });
      }

      if (game.variant === 'hard') {
        tasks.push({
          game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'hard',
          data: {
            doors: utils.game.getRandomItems(imageCardsDecks[3], 3),
            book: utils.game.getRandomItems(imageCardsDecks[4], 2),
          },
        });
      }
    });
  }

  // RETRATO_FALADO
  const hasRetratoFalado = getGameOnList(availableTasks, GAME_NAMES.RETRATO_FALADO);
  if (hasRetratoFalado.length > 0) {
    const monsters = Object.values(await resourceUtils.fetchTDIData('md/cards'));
    hasRetratoFalado.forEach(() => {
      tasks.push({
        game: GAME_NAMES.RETRATO_FALADO,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          card: utils.game.getRandomItem(monsters),
        },
      });
    });
  }

  // SUPER_CAMPEONATO
  const hasSuperCampeonato = getGameOnList(availableTasks, GAME_NAMES.SUPER_CAMPEONATO);
  if (hasSuperCampeonato.length > 0) {
    const contenders = (
      Object.values(await resourceUtils.fetchResource(TDR_RESOURCES.CONTENDERS)) as ContenderCard[]
    ).filter((c) => !c.exclusivity || c.exclusivity === language);
    const challenges = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.CHALLENGES}-${language}`)
    );
    hasSuperCampeonato.forEach(() => {
      tasks.push({
        game: GAME_NAMES.SUPER_CAMPEONATO,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          contenders: utils.game.getRandomItems(contenders, 2),
          challenge: utils.game.getRandomItem(challenges),
        },
      });
    });
  }

  // TESTEMUNHA_OCULAR
  const hasTestemunhaOcular = getGameOnList(availableTasks, GAME_NAMES.TESTEMUNHA_OCULAR);
  if (hasTestemunhaOcular.length > 0) {
    const testimonyQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`)
    );
    const suspects = Object.values(await resourceUtils.fetchTDIData('us/info'));
    hasTestemunhaOcular.forEach((game) => {
      // VARIANT: suspects
      if (game.variant === 'suspects') {
        tasks.push({
          game: GAME_NAMES.TESTEMUNHA_OCULAR,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'suspects',
          data: {
            question: utils.game.getRandomItem(testimonyQuestions),
            suspects: utils.game.getRandomItems(suspects, 3),
            answer: Boolean(utils.game.getRandomItem([true, false])),
          },
        });
      }

      // VARIANT: witness
      if (game.variant === 'witness') {
        tasks.push({
          game: GAME_NAMES.TESTEMUNHA_OCULAR,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'witness',
          data: {
            question: utils.game.getRandomItem(testimonyQuestions),
            suspect: utils.game.getRandomItem(suspects),
          },
        });
      }
    });
  }

  // UE_SO_ISSO
  const hasUeSoIsso = getGameOnList(availableTasks, GAME_NAMES.UE_SO_ISSO);
  if (hasUeSoIsso.length > 0) {
    hasUeSoIsso.forEach(() => {
      tasks.push({
        game: GAME_NAMES.UE_SO_ISSO,
        condition: WINNING_CONDITION.STRING_MATCH,
        data: {
          card: utils.game.getRandomItem(words),
        },
      });
    });
  }

  // New games
  // DILEMA_DOS_ESQUIADORES
  const hasDilemaDosEsquiadores = getGameOnList(availableTasks, GAME_NAMES.DILEMA_DOS_ESQUIADORES);
  if (hasDilemaDosEsquiadores.length > 0) {
    const dilemmas: DilemmaCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.DILEMMAS}-${language}`)
    );
    const selectedDilemas = options?.nsfw ? dilemmas : dilemmas.filter((dilemma) => !dilemma.nsfw);
    hasDilemaDosEsquiadores.forEach(() => {
      tasks.push({
        game: GAME_NAMES.DILEMA_DOS_ESQUIADORES,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          dilemma: utils.game.getRandomItem(selectedDilemas),
        },
      });
    });
  }

  // QUEM_NAO_MATA
  const hasQuemNaoMata = getGameOnList(availableTasks, GAME_NAMES.QUEM_NAO_MATA);
  if (hasQuemNaoMata.length > 0) {
    hasQuemNaoMata.forEach((game) => {
      // VARIANT: Kill
      if (game.variant === 'kill') {
        tasks.push({
          game: GAME_NAMES.QUEM_NAO_MATA,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'kill',
          data: {},
        });
      }

      if (game.variant === 'gold') {
        tasks.push({
          game: GAME_NAMES.QUEM_NAO_MATA,
          condition: WINNING_CONDITION.MOST_VOTED,
          variant: 'gold',
          data: {},
        });
      }
    });
  }

  // FILEIRA_DE_FATOS
  const hasFileiraDeFatos = getGameOnList(availableTasks, GAME_NAMES.FILEIRA_DE_FATOS);
  if (hasFileiraDeFatos.length > 0) {
    const quantitativeQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.QUANTITATIVE_QUESTIONS}-${language}`)
    ).filter((topic) => (topic as QuantitativeQuestionCard).scale);
    hasFileiraDeFatos.forEach(() => {
      tasks.push({
        game: GAME_NAMES.FILEIRA_DE_FATOS,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          card: utils.game.getRandomItem(quantitativeQuestions),
        },
      });
    });
  }

  // NAMORO_OU_AMIZADE
  const hasNamoroOuAmizade = getGameOnList(availableTasks, GAME_NAMES.NAMORO_OU_AMIZADE);
  if (hasNamoroOuAmizade.length > 0) {
    const heads = Object.values(await resourceUtils.fetchTDIData('dates/heads'));
    const bodies = Object.values(await resourceUtils.fetchTDIData('dates/bodies'));
    const candidatePersonalities: DatingCandidateCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.DATING_CANDIDATE}-${language}`)
    );
    const selectedPersonalities = getCandidatePersonality(candidatePersonalities);
    hasNamoroOuAmizade.forEach(() => {
      tasks.push({
        game: GAME_NAMES.NAMORO_OU_AMIZADE,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          heads: utils.game.getRandomItems(heads, 3),
          bodies: utils.game.getRandomItems(bodies, 3),
          ...selectedPersonalities,
        },
      });
    });
  }

  // CAMINHOS_MAGICOS
  const hasCaminhosMagicos = getGameOnList(availableTasks, GAME_NAMES.CAMINHOS_MAGICOS);
  if (hasCaminhosMagicos.length > 0) {
    const portals = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_3}-${language}`));
    const adjectives = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.ADJECTIVES}-${language}`)
    );
    hasCaminhosMagicos.forEach(() => {
      tasks.push({
        game: GAME_NAMES.CAMINHOS_MAGICOS,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          portals: utils.game.getRandomItems(portals, 3),
          adjectives: utils.game.getRandomItems(adjectives, 9),
        },
      });
    });
  }

  // PALHETA_DE_CORES
  const hasPalhetaDeCores = getGameOnList(availableTasks, GAME_NAMES.PALHETA_DE_CORES);
  if (hasPalhetaDeCores.length > 0) {
    const characters = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.CHARACTERS}-${language}`)
    );
    hasPalhetaDeCores.forEach(() => {
      tasks.push({
        game: GAME_NAMES.PALHETA_DE_CORES,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          card: utils.game.getRandomItem(characters),
          palette: [
            'red',
            'orange',
            'yellow',
            'green',
            'blue',
            'purple',
            'hotPink',
            'gray',
            'black',
            'white',
          ],
        },
      });
    });
  }

  // VAMOS_AO_CINEMA
  const hasVamosNoCinema = getGameOnList(availableTasks, GAME_NAMES.VAMOS_AO_CINEMA);
  if (hasVamosNoCinema.length > 0) {
    const movies = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.MOVIES}-${language}`));
    const allReviews: MovieReviewCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.MOVIE_REVIEWS}-${language}`)
    );
    const reviews = getMovieReviews(allReviews);
    hasVamosNoCinema.forEach(() => {
      tasks.push({
        game: GAME_NAMES.VAMOS_AO_CINEMA,
        condition: WINNING_CONDITION.MOST_VOTED,
        data: {
          movies: utils.game.getRandomItems(movies, 6),
          reviews,
        },
      });
    });
  }

  // Get full deck
  return {
    tasks,
  };
};
