// Constants
import { GAME_NAMES, SPRITE_LIBRARIES, TDR_RESOURCES } from '../../utils/constants';
// Types
import {
  AlienItem,
  ArteRuimCard,
  ArteRuimGroup,
  DatingCandidateCard,
  DilemmaCard,
  MovieReviewCard,
  SuspectCard,
  TextCard,
} from '../../types/tdr';
import type { MegamixGameOptions, ResourceData, Track, TrackCandidate } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import {
  CHARACTERS_TRACKS,
  DRAWING_TRACKS,
  IMAGES_TRACKS,
  JUDGING_TRACKS,
  OPINIONS_TRACKS,
  SPECIAL_TRACKS,
  TOTAL_ROUNDS,
  UNPOPULAR_TRACKS,
  WORDS_TRACKS,
} from './constants';
import {
  getCandidateOnList,
  getCandidatePersonality,
  getMovieReviews,
  getNaRuaDoMedoScenario,
  parseCrimeTiles,
} from './helpers';

/**
 * Get data based on the track options selected by the players
 * @param language
 * @param options
 * @param playerCount
 * @returns
 */
export const getData = async (
  language: Language,
  options: MegamixGameOptions,
  playerCount: number
): Promise<ResourceData> => {
  const customTracks: Track[] = [];

  const allowNSFW = Boolean(options.nsfw);
  const moreGameTracks = Boolean(options.moreTracks);

  // Get all custom tracks
  const possibleTracks: TrackCandidate[] = [];
  if (options.imagesTrack) {
    possibleTracks.push(getRandomTrackGame(IMAGES_TRACKS, allowNSFW));
  }
  if (options.charactersTrack) {
    possibleTracks.push(getRandomTrackGame(CHARACTERS_TRACKS, allowNSFW));
  }
  if (options.opinionsTrack) {
    possibleTracks.push(getRandomTrackGame(OPINIONS_TRACKS, allowNSFW));
  }
  if (options.drawingTrack) {
    possibleTracks.push(getRandomTrackGame(DRAWING_TRACKS, allowNSFW));
  }
  if (options.wordsTrack) {
    possibleTracks.push(getRandomTrackGame(WORDS_TRACKS, allowNSFW));
  }
  if (options.judgingTrack && allowNSFW) {
    possibleTracks.push(getRandomTrackGame(JUDGING_TRACKS, allowNSFW));
  }
  if (options.specialTrack) {
    possibleTracks.push(getRandomTrackGame(SPECIAL_TRACKS, allowNSFW));
  }
  if (options.unpopularTrack) {
    possibleTracks.push(getRandomTrackGame(UNPOPULAR_TRACKS, allowNSFW));
  }

  // Select tracks to be used
  const customTrackCandidatesQuantity = Math.min(possibleTracks.length, moreGameTracks ? 8 : 5);
  const customTrackCandidates = utils.game.getRandomItems(possibleTracks, customTrackCandidatesQuantity);

  // Get data for custom tracks data

  // IMAGES_TRACKS: DETETIVES_IMAGINATIVOS
  const detetiveImaginativosTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.DETETIVES_IMAGINATIVOS
  );
  if (detetiveImaginativosTrack) {
    const imageCardsDeck = await utils.imageCards.getImageCards(10, false);

    // VARIANT: Impostor
    if (detetiveImaginativosTrack.variant === 'detective') {
      customTracks.push({
        game: GAME_NAMES.DETETIVES_IMAGINATIVOS,

        variant: 'detective',
        data: {
          cards: utils.game.getRandomItems(imageCardsDeck, 4),
        },
      });
    }
    // VARIANT: Detective
    if (detetiveImaginativosTrack.variant === 'impostor') {
      const selectedCards = utils.game.sliceInParts(utils.game.getRandomItems(imageCardsDeck, 6), 2);
      customTracks.push({
        game: GAME_NAMES.DETETIVES_IMAGINATIVOS,

        variant: 'impostor',
        data: {
          table: selectedCards[0],
          cards: selectedCards[1],
        },
      });
    }
  }

  // IMAGES_TRACKS: GALERIA_DE_SONHOS
  const galeriaDeSonhosTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.GALERIA_DE_SONHOS);
  if (galeriaDeSonhosTrack) {
    const imageCardsDeck = await utils.imageCards.getImageCards(10, false);
    const themes = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_THEME}-${language}`)
    );
    customTracks.push({
      game: GAME_NAMES.GALERIA_DE_SONHOS,
      data: {
        cards: utils.game.getRandomItems(imageCardsDeck, 3),
        theme: utils.game.getRandomItem(themes),
      },
    });
  }

  // IMAGE_TRACKS: PORTA_DOS_DESESPERADOS
  const portaDosDesesperadosTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.PORTA_DOS_DESESPERADOS
  );
  if (portaDosDesesperadosTrack) {
    const imageCardsDeck = await utils.imageCards.getImageCards(10, false);
    customTracks.push({
      game: GAME_NAMES.PORTA_DOS_DESESPERADOS,

      variant: 'normal',
      data: {
        doors: utils.game.getRandomItems(imageCardsDeck, 3),
        book: utils.game.getRandomItems(imageCardsDeck, 1),
      },
    });
  }

  // IMAGE_TRACKS: CONTADORES_HISTORIAS
  const contadoresHistoriasTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CONTADORES_HISTORIAS);
  if (contadoresHistoriasTrack) {
    const imageCardsDeck = await utils.imageCards.getImageCards(10, false);
    const cards: ArteRuimCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.ARTE_RUIM_CARDS}-${language}`)
    );
    customTracks.push({
      game: GAME_NAMES.CONTADORES_HISTORIAS,
      data: {
        cards: utils.game.getRandomItems(imageCardsDeck, 3),
        prompts: utils.game.getRandomItems(cards, 5),
      },
    });
  }

  // CHARACTERS_TRACKS: SUPER_CAMPEONATO
  const superCampeonatoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.SUPER_CAMPEONATO);
  if (superCampeonatoTrack) {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, 2);
    const challenges = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.CHALLENGES}-${language}`)
    );

    customTracks.push({
      game: GAME_NAMES.SUPER_CAMPEONATO,
      data: {
        contenders,
        challenge: utils.game.getRandomItem(challenges),
      },
    });
  }

  // CHARACTERS_TRACKS: QUEM_SOU_EU
  const quemSouEuTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.QUEM_SOU_EU);
  if (quemSouEuTrack) {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, 3);

    const glyphs = utils.game.sliceInParts(
      utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.GLYPHS, 1), 4),
      2
    );

    customTracks.push({
      game: GAME_NAMES.QUEM_SOU_EU,
      data: {
        contenders,
        positive: glyphs[0],
        negative: glyphs[1],
      },
    });
  }

  // CHARACTERS_TRACKS: PALHETA_DE_CORES
  const palhetaDeCoresTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.PALHETA_DE_CORES);
  if (palhetaDeCoresTrack) {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, 1);

    customTracks.push({
      game: GAME_NAMES.PALHETA_DE_CORES,
      data: {
        card: utils.game.getRandomItem(contenders),
        palette: utils.game.getRandomItems(
          ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'hotPink', 'gray', 'black', 'white'],
          4
        ),
      },
    });
  }

  // OPINIONS_TRACKS: POLEMICA_DA_VEZ
  const polemicaDaVezTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.POLEMICA_DA_VEZ);
  if (polemicaDaVezTrack) {
    type CustomTweet = TextCard & { custom?: boolean };
    const tweets = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.TWEETS}-${language}`)
    ).filter((tweet) => !(tweet as CustomTweet).custom);

    customTracks.push({
      game: GAME_NAMES.POLEMICA_DA_VEZ,
      data: {
        card: utils.game.getRandomItem(tweets),
      },
    });
  }

  // OPINIONS_TRACKS: FILEIRA_DE_FATOS
  const fileiraDeFatosTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.FILEIRA_DE_FATOS);
  if (fileiraDeFatosTrack) {
    const allScenarios = await resourceUtils.fetchResource(`${TDR_RESOURCES.SCENARIOS}-${language}`);
    customTracks.push({
      game: GAME_NAMES.FILEIRA_DE_FATOS,
      data: {
        scenarios: utils.game.getRandomItems(Object.values(allScenarios), 3),
      },
    });
  }

  // OPINIONS_TRACKS: DILEMA_DOS_ESQUIADORES
  const dilemaDosEsquiadoresTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.DILEMA_DOS_ESQUIADORES
  );
  if (dilemaDosEsquiadoresTrack) {
    const dilemmas: DilemmaCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.DILEMMAS}-${language}`)
    );
    const selectedDilemas = allowNSFW ? dilemmas : dilemmas.filter((dilemma) => !dilemma.nsfw);

    customTracks.push({
      game: GAME_NAMES.DILEMA_DOS_ESQUIADORES,
      data: {
        dilemma: utils.game.getRandomItem(selectedDilemas),
      },
    });
  }

  // DRAWING_TRACKS: ARTE_RUIM
  const arteRuimTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.ARTE_RUIM);
  if (arteRuimTrack) {
    const cardsGroups: ArteRuimGroup[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.ARTE_RUIM_GROUPS}-${language}`)
    );
    const [arteGroup1, arteGroup2] = utils.game.getRandomItems(cardsGroups, 2);
    // VARIANT: CARDS
    if (arteRuimTrack.variant === 'cards') {
      // 1 drawing for 3 cards
      customTracks.push({
        game: GAME_NAMES.ARTE_RUIM,

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
    if (arteRuimTrack.variant === 'drawings') {
      // 3 drawings for 1 cards
      customTracks.push({
        game: GAME_NAMES.ARTE_RUIM,

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
  }

  // DRAWING_TRACKS: RETRATO_FALADO
  const retratoFaladoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.RETRATO_FALADO);
  if (retratoFaladoTrack) {
    const monsters = Object.values(await resourceUtils.fetchTDIData('md/cards'));

    customTracks.push({
      game: GAME_NAMES.RETRATO_FALADO,
      data: {
        card: utils.game.getRandomItem(monsters),
      },
    });
  }

  // WORDS_TRACKS: CRUZA_PALAVRAS
  const cruzaPalavrasTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CRUZA_PALAVRAS);
  if (cruzaPalavrasTrack) {
    const words = await utils.tdr.getSingleWords(language);

    customTracks.push({
      game: GAME_NAMES.CRUZA_PALAVRAS,
      data: {
        cards: utils.game.getRandomItems(words, 4),
        clue: utils.game.getRandomItem(words),
      },
    });
  }

  // WORDS_TRACKS: UE_SO_ISSO
  const ueSoIssoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.UE_SO_ISSO);
  if (ueSoIssoTrack) {
    const words = await utils.tdr.getSingleWords(language);
    customTracks.push({
      game: GAME_NAMES.UE_SO_ISSO,
      data: {
        cards: utils.game.getRandomItems(words, 3),
      },
    });
  }

  // WORDS_TRACKS: LABIRINTO_SECRETO
  const labirintoSecretoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.LABIRINTO_SECRETO);
  if (labirintoSecretoTrack) {
    const trees = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.WORDS_TREES}-${language}`)
    );
    const adjectives = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.ADJECTIVES}-${language}`)
    );

    customTracks.push({
      game: GAME_NAMES.LABIRINTO_SECRETO,
      data: {
        trees: utils.game.getRandomItems(trees, 3),
        adjectives: utils.game.getRandomItems(adjectives, 9),
      },
    });
  }

  // JUDGING_TRACKS: TESTEMUNHA_OCULAR
  const testemunhaOcularTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.TESTEMUNHA_OCULAR);
  if (testemunhaOcularTrack) {
    const testimonyQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`)
    );
    const suspects: SuspectCard[] = Object.values(await resourceUtils.fetchTDIData('us/info'));
    const deckType = utils.game.getRandomItem(['ct', 'alt', 'ai']);
    customTracks.push({
      game: GAME_NAMES.TESTEMUNHA_OCULAR,
      data: {
        question: utils.game.getRandomItem(testimonyQuestions),
        suspects: utils.game.getRandomItems(suspects, 3).map((suspect) => ({
          ...suspect,
          id: `us-${deckType}-${suspect.id.split('-')[1]}`,
        })),
        answer: Boolean(utils.game.getRandomItem([true, false])),
      },
    });
  }

  // JUDGING_TRACKS: TA_NA_CARA
  const taNaCaraTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.TA_NA_CARA);
  if (taNaCaraTrack) {
    const testimonyQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`)
    );
    const suspects: SuspectCard[] = Object.values(await resourceUtils.fetchTDIData('us/info'));
    const deckType = utils.game.getRandomItem(['ct', 'alt', 'ai']);
    const suspect = utils.game.getRandomItem(suspects);
    customTracks.push({
      game: GAME_NAMES.TA_NA_CARA,

      variant: 'witness',
      data: {
        question: utils.game.getRandomItem(testimonyQuestions),
        suspect: { ...suspect, id: `us-${deckType}-${suspect.id.split('-')[1]}` },
      },
    });
  }

  // JUDGING_TRACKS: NAMORO_OU_AMIZADE
  const namoroOuAmizadeTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.NAMORO_OU_AMIZADE);
  if (namoroOuAmizadeTrack) {
    const heads = Object.values(await resourceUtils.fetchTDIData('dates/heads'));
    const bodies = Object.values(await resourceUtils.fetchTDIData('dates/bodies'));
    const candidatePersonalities: DatingCandidateCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.DATING_CANDIDATE}-${language}`)
    );
    const selectedPersonalities = getCandidatePersonality(candidatePersonalities);

    customTracks.push({
      game: GAME_NAMES.NAMORO_OU_AMIZADE,
      data: {
        heads: utils.game.getRandomItems(heads, 3),
        bodies: utils.game.getRandomItems(bodies, 3),
        ...selectedPersonalities,
      },
    });
  }

  // SPECIAL_TRACKS: ONDA_TELEPATICA
  const ondaTelepaticaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.ONDA_TELEPATICA);
  if (ondaTelepaticaTrack) {
    const opposingIdeas = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.OPPOSING_IDEAS}-${language}`)
    );

    customTracks.push({
      game: GAME_NAMES.ONDA_TELEPATICA,
      data: {
        card: utils.game.getRandomItem(opposingIdeas),
        side: utils.game.getRandomItem(['left', 'right']),
      },
    });
  }

  // SPECIAL_TRACKS: COMUNICACAO_ALIENIGENA
  const comunicacaoAlienigenaTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.COMUNICACAO_ALIENIGENA
  );
  if (comunicacaoAlienigenaTrack) {
    const attributes = {
      alive: { id: 'alive', name: { en: 'Alive', pt: 'Vivo' } },
      beautiful: { id: 'beautiful', name: { en: 'Beautiful', pt: 'Bonito' } },
      big: { id: 'big', name: { en: 'Big', pt: 'Grande' } },
      bright: { id: 'bright', name: { en: 'Bright', pt: 'Brilho' } },
      clothes: { id: 'clothes', name: { en: 'Clothes', pt: 'Vestimenta' } },
      danger: { id: 'danger', name: { en: 'Danger', pt: 'Perigo' } },
      defense: { id: 'defense', name: { en: 'Defense', pt: 'Defesa' } },
      fast: { id: 'fast', name: { en: 'Fast', pt: 'Rápido' } },
      flat: { id: 'flat', name: { en: 'Flat', pt: 'Plano' } }, // New
      flight: { id: 'flight', name: { en: 'Flight', pt: 'Vôo' } },
      food: { id: 'food', name: { en: 'Food', pt: 'Comida' } },
      hard: { id: 'hard', name: { en: 'Hard', pt: 'Duro' } }, // New
      heavy: { id: 'heavy', name: { en: 'Heavy', pt: 'Pesado' } },
      human: { id: 'human', name: { en: 'Human', pt: 'Humano' } },
      knowledge: { id: 'knowledge', name: { en: 'Knowledge', pt: 'Conhecimento' } },
      liquid: { id: 'liquid', name: { en: 'Liquid', pt: 'Líquido' } },
      long: { id: 'long', name: { en: 'Long', pt: 'Longo' } },
      machine: { id: 'machine', name: { en: 'Machine', pt: 'Máquina' } }, // New
      metal: { id: 'metal', name: { en: 'Metal', pt: 'Metal' } },
      odor: { id: 'odor', name: { en: 'Odor', pt: 'Cheiro' } }, // New
      old: { id: 'old', name: { en: 'Old', pt: 'Velho' } }, // New
      plant: { id: 'plant', name: { en: 'Plant', pt: 'Planta' } },
      power: { id: 'power', name: { en: 'Power', pt: 'Força' } },
      round: { id: 'round', name: { en: 'Round', pt: 'Redondo' } },
      sharp: { id: 'sharp', name: { en: 'Sharp', pt: 'Afiado' } },
      sound: { id: 'sound', name: { en: 'Sound', pt: 'Som' } }, // New
      tool: { id: 'tool', name: { en: 'Tool', pt: 'Ferramenta' } },
      valuable: { id: 'valuable', name: { en: 'Valuable', pt: 'Valioso' } },
      warm: { id: 'warm', name: { en: 'Warm', pt: 'Quente' } },
      weapon: { id: 'weapon', name: { en: 'Weapon', pt: 'Arma' } },
    };
    const selectedAttributes = utils.game.getRandomItems(Object.values(attributes), 2);

    const allAlienItemsObj: Collection<AlienItem> = await resourceUtils.fetchResource(
      TDR_RESOURCES.ALIEN_ITEMS
    );

    const selectedAlienItems: AlienItem[] = utils.game.getRandomItems(
      allowNSFW
        ? Object.values(allAlienItemsObj)
        : Object.values(allAlienItemsObj).filter((item) => !item.nsfw),
      5
    );

    customTracks.push({
      game: GAME_NAMES.COMUNICACAO_ALIENIGENA,
      data: {
        items: selectedAlienItems,
        attributes: selectedAttributes,
        signs: utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.ALIEN_SIGNS, 0), 2),
      },
    });
  }

  // SPECIAL_TRACKS: MENTE_COLETIVA
  const menteColetivaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.MENTE_COLETIVA);
  if (menteColetivaTrack) {
    const groupQuestions = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.GROUP_QUESTIONS}-${language}`)
    );

    customTracks.push({
      game: GAME_NAMES.MENTE_COLETIVA,
      data: {
        question: utils.game.getRandomItem(groupQuestions),
      },
    });
  }

  // UNPOPULAR_TRACKS: CRIMES_HEDIONDOS
  const crimesHediondosTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CRIMES_HEDIONDOS);
  if (crimesHediondosTrack) {
    const allWeapons = await resourceUtils.fetchTDIData('dmhk/wp');
    const allEvidence = await resourceUtils.fetchTDIData('dmhk/ev');
    const allScenes = await resourceUtils.fetchResource(TDR_RESOURCES.CRIME_TILES);
    const crimes = parseCrimeTiles(allScenes);

    // VARIANT: WEAPON
    if (crimesHediondosTrack.variant === 'weapon') {
      // Weapon Game
      customTracks.push({
        game: GAME_NAMES.CRIMES_HEDIONDOS,
        variant: 'weapon',
        data: {
          cards: utils.game.getRandomItems(Object.values(allWeapons), 3),
          scenes: crimes.weapon.scenes,
          crimeIndexes: crimes.weapon.crime,
        },
      });
    }

    // VARIANT: EVIDENCE
    if (crimesHediondosTrack.variant === 'evidence') {
      // Object Game
      customTracks.push({
        game: GAME_NAMES.CRIMES_HEDIONDOS,
        variant: 'evidence',
        data: {
          cards: utils.game.getRandomItems(Object.values(allEvidence), 3),
          scenes: crimes.evidence.scenes,
          crimeIndexes: crimes.evidence.crime,
        },
      });
    }
  }

  // UNPOPULAR_TRACKS: VAMOS_AO_CINEMA
  const vamosAoCinemaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.VAMOS_AO_CINEMA);
  if (vamosAoCinemaTrack) {
    const movies = Object.values(await resourceUtils.fetchResource(`${TDR_RESOURCES.MOVIES}-${language}`));
    const allReviews: MovieReviewCard[] = Object.values(
      await resourceUtils.fetchResource(`${TDR_RESOURCES.MOVIE_REVIEWS}-${language}`)
    );
    const reviews = getMovieReviews(allReviews);

    customTracks.push({
      game: GAME_NAMES.VAMOS_AO_CINEMA,
      data: {
        movies: utils.game.getRandomItems(movies, 6),
        reviews,
      },
    });
  }

  // UNPOPULAR_TRACKS: NA_RUA_DO_MEDO
  const naRuaDoMedoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.NA_RUA_DO_MEDO);
  if (naRuaDoMedoTrack) {
    const streetData = getNaRuaDoMedoScenario(playerCount);

    customTracks.push({
      game: GAME_NAMES.NA_RUA_DO_MEDO,
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

  // UNPOPULAR_TRACKS: QUEM_NAO_MATA
  const quemNaoMataTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.QUEM_NAO_MATA);
  if (quemNaoMataTrack) {
    customTracks.push({
      game: GAME_NAMES.QUEM_NAO_MATA,
      variant: 'kill',
      data: {},
    });
  }

  // Get default megamix tracks
  const allChoices = Object.values(
    await resourceUtils.fetchResource(`${TDR_RESOURCES.CHOICES}-${language}`)
  ) as PlainObject[];
  const shuffledChoices = utils.game.shuffle(allChoices);

  const selectedChoices = new Array(TOTAL_ROUNDS).fill(null);
  let thisThatIndex = 0;
  let bestOfThreeIndex = 1;
  for (let i = 0; i < shuffledChoices.length; i++) {
    const choice = shuffledChoices[i];
    if (choice.type === 'this-that' && thisThatIndex <= TOTAL_ROUNDS) {
      selectedChoices[thisThatIndex] = choice;
      thisThatIndex += 2;
    }
    if (choice.type === 'best-of-three' && bestOfThreeIndex <= TOTAL_ROUNDS) {
      selectedChoices[bestOfThreeIndex] = choice;
      bestOfThreeIndex += 2;
    }
    if (bestOfThreeIndex >= TOTAL_ROUNDS + 3) {
      break;
    }
  }
  selectedChoices.reverse();

  const filteredCustomTracks = utils.game.shuffle(customTracks.filter((track) => !!track?.game));
  // Build track order
  const tracks: Track[] = [];
  const customTrackInterval = Math.ceil(TOTAL_ROUNDS / filteredCustomTracks.length);
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    if (i > 0 && i % customTrackInterval === 1 && filteredCustomTracks.length > 0) {
      const track = filteredCustomTracks.pop() as Track;
      tracks.push(track);
    } else {
      const card = selectedChoices.pop() as PlainObject;
      tracks.push({
        game: `${GAME_NAMES.MEGAMIX}-${card.type}`,
        data: {
          card: card,
        },
      });
    }
  }

  /**
   * Games not represented here:
   * espiao-entre-nos
   * linhas-cruzadas
   * sonhos-pesadelos
   * vendaval-de-palpite
   */

  // // ESPIAO_ENTRE_NOS
  // const hasEspiaoEntreNos = getGameOnList(availableTracks, GAME_NAMES.ESPIAO_ENTRE_NOS);
  // if (hasEspiaoEntreNos.length > 0) {
  //   const spyLocations = Object.values(
  //     await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_LOCATIONS}-${language}`)
  //   );
  //   const spyQuestions = Object.values(
  //     await resourceUtils.fetchResource(`${TDR_RESOURCES.SPY_QUESTIONS}-${language}`)
  //   );
  //   const location = utils.game.getRandomItem(spyLocations) as SpyLocation;
  //   hasEspiaoEntreNos.forEach(() => {
  //     customTracks.push({
  //       game: GAME_NAMES.ESPIAO_ENTRE_NOS,
  //       condition: WINNING_CONDITION.STRING_MATCH,
  //       data: {
  //         location: location,
  //         question: utils.game.getRandomItem(spyQuestions),
  //         roleIndex: utils.game.getRandomNumber(0, location.roles.length - 1),
  //       },
  //     });
  //   });
  // }

  // Get full deck
  return {
    tracks,
  };
};

const getRandomTrackGame = (candidates: TrackCandidate[], allowNSFW: boolean) => {
  const options: TrackCandidate[] = [];

  candidates.forEach((candidate) => {
    if (!candidate.nsfw || allowNSFW) {
      for (let i = 0; i < candidate.weight; i++) {
        options.push(candidate);
      }
    }
  });

  return utils.game.getRandomItem(options);
};
