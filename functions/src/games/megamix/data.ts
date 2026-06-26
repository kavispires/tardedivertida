import { sample, sampleSize, shuffle } from 'lodash';
// Types
import type {
  ArteRuimCardData,
  ArteRuimGroupData,
  ChoiceCardData,
  CrimeSceneTileData,
  CrimesHediondosCardData,
  DatingCandidateCardData,
  DatingCandidateImageCardData,
  DilemmaCardData,
  GroupQuestionCardData,
  ItemAttributeData,
  MonsterImageData,
  MovieCardData,
  MovieReviewCardData,
  SpectrumCardData,
  TestimonyQuestionCardData,
  TextCardData,
} from '../../types/tdr';
import type { MegamixGameOptions, ResourceData, Track, TrackCandidate } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { TDR_RESOURCES } from '../../constants/resources';
import { SPRITE_LIBRARIES } from '../../constants/sprites';
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
// Services
import { fetchResource } from '../../services/resource';
// Resources
import { getContenders, getItems, getSingleWords, getSuspects, itemUtils } from '../../mechanics/resources';
// Mechanics
import { getImageCards } from '../../mechanics/image-cards';
// Utils
import { makeArray, sliceInParts } from '../../utils';
// Internal
import {
  getCandidateOnList,
  getCandidatePersonality,
  getMovieReviews,
  getNaRuaDoMedoScenario,
  parseCrimeTiles,
} from './helpers';

/**
 * Get data based on the track options selected by the players
 * @param language - The language code for localized resources
 * @param options - Game options including tracks selection and NSFW setting
 * @param playerCount - Number of players in the game
 * @returns Resource data containing custom tracks for the megamix game
 */
export const getData = async (
  language: Language,
  options: MegamixGameOptions,
  playerCount: number,
): Promise<ResourceData> => {
  const customTracks: Track[] = [];

  const allowNSFW = Boolean(options.nsfw);
  const moreGameTracks = Boolean(options.moreTracks);

  // Get all custom tracks
  const possibleTracks: TrackCandidate[] = [];
  if (options.tracks.includes('images')) {
    possibleTracks.push(getRandomTrackGame(IMAGES_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('characters')) {
    possibleTracks.push(getRandomTrackGame(CHARACTERS_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('opinions')) {
    possibleTracks.push(getRandomTrackGame(OPINIONS_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('drawing')) {
    possibleTracks.push(getRandomTrackGame(DRAWING_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('words')) {
    possibleTracks.push(getRandomTrackGame(WORDS_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('judging') && allowNSFW) {
    possibleTracks.push(getRandomTrackGame(JUDGING_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('special')) {
    possibleTracks.push(getRandomTrackGame(SPECIAL_TRACKS, allowNSFW)!);
  }
  if (options.tracks.includes('unpopular')) {
    possibleTracks.push(getRandomTrackGame(UNPOPULAR_TRACKS, allowNSFW)!);
  }

  // Select tracks to be used
  const customTrackCandidatesQuantity = Math.min(possibleTracks.length, moreGameTracks ? 8 : 5);
  const customTrackCandidates = sampleSize(possibleTracks, customTrackCandidatesQuantity);

  // Get data for custom tracks data

  // IMAGES_TRACKS: DETETIVES_IMAGINATIVOS
  const detetiveImaginativosTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.DETETIVES_IMAGINATIVOS,
  );
  if (detetiveImaginativosTrack) {
    const imageCardsDeck = await getImageCards(10);

    // VARIANT: Impostor
    if (detetiveImaginativosTrack.variant === 'detective') {
      customTracks.push({
        game: GAME_NAMES.DETETIVES_IMAGINATIVOS,

        variant: 'detective',
        data: {
          cards: sampleSize(imageCardsDeck, 4),
        },
      });
    }
    // VARIANT: Detective
    if (detetiveImaginativosTrack.variant === 'impostor') {
      const selectedCards = sliceInParts(sampleSize(imageCardsDeck, 6), 2);
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
    const imageCardsDeck = await getImageCards(10);
    const themes = Object.values(
      await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.THEME_WORDS, language),
    );
    customTracks.push({
      game: GAME_NAMES.GALERIA_DE_SONHOS,
      data: {
        cards: sampleSize(imageCardsDeck, 3),
        theme: sample(themes),
      },
    });
  }

  // IMAGE_TRACKS: PORTA_DOS_DESESPERADOS
  const portaDosDesesperadosTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.PORTA_DOS_DESESPERADOS,
  );
  if (portaDosDesesperadosTrack) {
    const imageCardsDeck = await getImageCards(10);
    customTracks.push({
      game: GAME_NAMES.PORTA_DOS_DESESPERADOS,

      variant: 'normal',
      data: {
        doors: sampleSize(imageCardsDeck, 3),
        book: sampleSize(imageCardsDeck, 1),
      },
    });
  }

  // IMAGE_TRACKS: CONTADORES_HISTORIAS
  const contadoresHistoriasTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CONTADORES_HISTORIAS);
  if (contadoresHistoriasTrack) {
    const imageCardsDeck = await getImageCards(10);
    const cards = Object.values(
      await fetchResource<Dictionary<ArteRuimCardData>>(TDR_RESOURCES.ARTE_RUIM_CARDS, language),
    );
    customTracks.push({
      game: GAME_NAMES.CONTADORES_HISTORIAS,
      data: {
        cards: sampleSize(imageCardsDeck, 3),
        prompts: sampleSize(cards, 5),
      },
    });
  }

  // CHARACTERS_TRACKS: SUPER_CAMPEONATO
  const superCampeonatoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.SUPER_CAMPEONATO);
  if (superCampeonatoTrack) {
    const contenders = await getContenders(language, allowNSFW, ['any'], 2);
    const challenges = Object.values(
      await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.CHALLENGES, language),
    );

    customTracks.push({
      game: GAME_NAMES.SUPER_CAMPEONATO,
      data: {
        contenders,
        challenge: sample(challenges),
      },
    });
  }

  // CHARACTERS_TRACKS: QUEM_SOU_EU
  const quemSouEuTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.QUEM_SOU_EU);
  if (quemSouEuTrack) {
    const contenders = await getContenders(language, allowNSFW, ['any'], 3);

    const glyphs = sliceInParts(sampleSize(makeArray(SPRITE_LIBRARIES.GLYPHS, 1), 4), 2);

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
    const contenders = await getContenders(language, allowNSFW, ['any'], 1);

    customTracks.push({
      game: GAME_NAMES.PALHETA_DE_CORES,
      data: {
        card: sample(contenders),
        palette: sampleSize(
          ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'hotPink', 'gray', 'black', 'white'],
          4,
        ),
      },
    });
  }

  // OPINIONS_TRACKS: POLEMICA_DA_VEZ
  const polemicaDaVezTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.POLEMICA_DA_VEZ);
  if (polemicaDaVezTrack) {
    type CustomTweet = TextCardData & { custom?: boolean };
    const tweets = Object.values(
      await fetchResource<Dictionary<CustomTweet>>(TDR_RESOURCES.TWEETS, language),
    ).filter((tweet) => !tweet.custom);

    customTracks.push({
      game: GAME_NAMES.POLEMICA_DA_VEZ,
      data: {
        card: sample(tweets),
      },
    });
  }

  // OPINIONS_TRACKS: FILEIRA_DE_FATOS
  const fileiraDeFatosTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.FILEIRA_DE_FATOS);
  if (fileiraDeFatosTrack) {
    const allScenarios = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.SCENARIOS, language);
    customTracks.push({
      game: GAME_NAMES.FILEIRA_DE_FATOS,
      data: {
        scenarios: sampleSize(Object.values(allScenarios), 3),
      },
    });
  }

  // OPINIONS_TRACKS: ESQUIADORES
  const esquiadoresTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.ESQUIADORES);
  if (esquiadoresTrack) {
    const dilemmas: DilemmaCardData[] = Object.values(
      await fetchResource<Dictionary<DilemmaCardData>>(TDR_RESOURCES.DILEMMAS, language),
    );
    const selectedDilemas = allowNSFW ? dilemmas : dilemmas.filter((dilemma) => !dilemma.nsfw);

    customTracks.push({
      game: GAME_NAMES.ESQUIADORES,
      data: {
        dilemma: sample(selectedDilemas),
      },
    });
  }

  // DRAWING_TRACKS: ARTE_RUIM
  const arteRuimTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.ARTE_RUIM);
  if (arteRuimTrack) {
    const cardsGroups: ArteRuimGroupData[] = Object.values(
      await fetchResource<Dictionary<ArteRuimGroupData>>(TDR_RESOURCES.ARTE_RUIM_GROUPS, language),
    );
    const [arteGroup1, arteGroup2] = sampleSize(cardsGroups, 2);
    // VARIANT: CARDS
    if (arteRuimTrack.variant === 'cards') {
      // 1 drawing for 3 cards
      customTracks.push({
        game: GAME_NAMES.ARTE_RUIM,

        variant: 'cards',
        data: {
          cards: sampleSize(Object.entries(arteGroup1.cards), 3).reduce((acc: TextCardData[], [id, text]) => {
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
          cards: sampleSize(Object.entries(arteGroup2.cards), 3).reduce((acc: TextCardData[], [id, text]) => {
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
    const monsters = Object.values(
      await fetchResource<Dictionary<MonsterImageData>>(TDR_RESOURCES.MONSTER_ORIENTATION),
    );

    customTracks.push({
      game: GAME_NAMES.RETRATO_FALADO,
      data: {
        card: sample(monsters),
      },
    });
  }

  // WORDS_TRACKS: CRUZA_PALAVRAS
  const cruzaPalavrasTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CRUZA_PALAVRAS);
  if (cruzaPalavrasTrack) {
    const words = await getSingleWords(language);

    customTracks.push({
      game: GAME_NAMES.CRUZA_PALAVRAS,
      data: {
        cards: sampleSize(words, 4),
        clue: sample(words),
      },
    });
  }

  // WORDS_TRACKS: UE_SO_ISSO
  const ueSoIssoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.UE_SO_ISSO);
  if (ueSoIssoTrack) {
    const words = await getSingleWords(language);
    customTracks.push({
      game: GAME_NAMES.UE_SO_ISSO,
      data: {
        cards: sampleSize(words, 3),
      },
    });
  }

  // WORDS_TRACKS: LABIRINTO_SECRETO
  const labirintoSecretoTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.LABIRINTO_SECRETO);
  if (labirintoSecretoTrack) {
    const trees = Object.values(
      await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.TREE_WORDS, language),
    );
    const adjectives = Object.values(
      await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.ADJECTIVES, language),
    );

    customTracks.push({
      game: GAME_NAMES.LABIRINTO_SECRETO,
      data: {
        trees: sampleSize(trees, 3),
        adjectives: sampleSize(adjectives, 9),
      },
    });
  }

  // JUDGING_TRACKS: TESTEMUNHA_OCULAR
  const testemunhaOcularTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.TESTEMUNHA_OCULAR);
  if (testemunhaOcularTrack) {
    const testimonyQuestions = Object.values(
      await fetchResource<Dictionary<TestimonyQuestionCardData>>(TDR_RESOURCES.TESTIMONY_QUESTIONS, language),
    );
    const suspects = await getSuspects({
      randomStyleVariant: true,
      quantity: 3,
      cleanup: true,
      decks: ['adult'],
    });

    customTracks.push({
      game: GAME_NAMES.TESTEMUNHA_OCULAR,
      data: {
        question: sample(testimonyQuestions),
        suspects: suspects,
        answer: Boolean(sample([true, false])),
      },
    });
  }

  // JUDGING_TRACKS: TA_NA_CARA
  const taNaCaraTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.TA_NA_CARA);
  if (taNaCaraTrack) {
    const testimonyQuestions = Object.values(
      await fetchResource<Dictionary<TestimonyQuestionCardData>>(TDR_RESOURCES.TESTIMONY_QUESTIONS, language),
    );

    const suspects = await getSuspects({
      randomStyleVariant: true,
      quantity: 1,
      cleanup: true,
      decks: ['adult'],
    });

    customTracks.push({
      game: GAME_NAMES.TA_NA_CARA,
      variant: 'witness',
      data: {
        question: sampleSize(testimonyQuestions, 1)[0],
        suspect: suspects[0],
      },
    });
  }

  // JUDGING_TRACKS: NAMORO_OU_AMIZADE
  const namoroOuAmizadeTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.NAMORO_OU_AMIZADE);
  if (namoroOuAmizadeTrack) {
    const heads = Object.values(
      await fetchResource<Dictionary<DatingCandidateImageCardData>>(TDR_RESOURCES.DATING_CANDIDATE_HEADS),
    );
    const bodies = Object.values(
      await fetchResource<Dictionary<DatingCandidateImageCardData>>(TDR_RESOURCES.DATING_CANDIDATE_BODIES),
    );
    const candidatePersonalities = Object.values(
      await fetchResource<Dictionary<DatingCandidateCardData>>(TDR_RESOURCES.DATING_CANDIDATE, language),
    );
    const selectedPersonalities = getCandidatePersonality(candidatePersonalities);

    customTracks.push({
      game: GAME_NAMES.NAMORO_OU_AMIZADE,
      data: {
        heads: sampleSize(heads, 3),
        bodies: sampleSize(bodies, 3),
        ...selectedPersonalities,
      },
    });
  }

  // SPECIAL_TRACKS: ONDA_TELEPATICA
  const ondaTelepaticaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.ONDA_TELEPATICA);
  if (ondaTelepaticaTrack) {
    const opposingIdeas = Object.values(
      await fetchResource<Dictionary<SpectrumCardData>>(TDR_RESOURCES.SPECTRUMS, language),
    );

    customTracks.push({
      game: GAME_NAMES.ONDA_TELEPATICA,
      data: {
        card: sample(opposingIdeas),
        side: sample(['left', 'right']),
      },
    });
  }

  // SPECIAL_TRACKS: COMUNICACAO_ALIENIGENA
  const comunicacaoAlienigenaTrack = getCandidateOnList(
    customTrackCandidates,
    GAME_NAMES.COMUNICACAO_ALIENIGENA,
  );
  if (comunicacaoAlienigenaTrack) {
    const attributes = Object.values(
      await fetchResource<Dictionary<ItemAttributeData>>(TDR_RESOURCES.ITEMS_ATTRIBUTES),
    );
    const selectedAttributes = sampleSize(Object.values(attributes), 2);

    const selectedAlienItems = await getItems(5, {
      allowNSFW,
      decks: ['alien'],
      cleanUp: itemUtils.cleanupDecks,
    });

    customTracks.push({
      game: GAME_NAMES.COMUNICACAO_ALIENIGENA,
      data: {
        items: selectedAlienItems,
        attributes: selectedAttributes,
        signs: sampleSize(makeArray(SPRITE_LIBRARIES.ALIEN_SIGNS, 0), 2),
      },
    });
  }

  // SPECIAL_TRACKS: MENTE_COLETIVA
  const menteColetivaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.MENTE_COLETIVA);
  if (menteColetivaTrack) {
    const groupQuestions = Object.values(
      await fetchResource<Dictionary<GroupQuestionCardData>>(TDR_RESOURCES.GROUP_QUESTIONS, language),
    );

    customTracks.push({
      game: GAME_NAMES.MENTE_COLETIVA,
      data: {
        question: sample(groupQuestions),
      },
    });
  }

  // UNPOPULAR_TRACKS: CRIMES_HEDIONDOS
  const crimesHediondosTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.CRIMES_HEDIONDOS);
  if (crimesHediondosTrack) {
    const allWeapons = await fetchResource<Dictionary<CrimesHediondosCardData>>(TDR_RESOURCES.CRIME_WEAPONS);
    const allEvidence = await fetchResource<Dictionary<CrimesHediondosCardData>>(
      TDR_RESOURCES.CRIME_EVIDENCE,
    );
    const allScenes = await fetchResource<Dictionary<CrimeSceneTileData>>(TDR_RESOURCES.CRIME_SCENES);
    const crimes = parseCrimeTiles(Object.values(allScenes));

    // VARIANT: WEAPON
    if (crimesHediondosTrack.variant === 'weapon') {
      // Weapon Game
      customTracks.push({
        game: GAME_NAMES.CRIMES_HEDIONDOS,
        variant: 'weapon',
        data: {
          cards: sampleSize(Object.values(allWeapons), 3),
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
          cards: sampleSize(Object.values(allEvidence), 3),
          scenes: crimes.evidence.scenes,
          crimeIndexes: crimes.evidence.crime,
        },
      });
    }
  }

  // UNPOPULAR_TRACKS: VAMOS_AO_CINEMA
  const vamosAoCinemaTrack = getCandidateOnList(customTrackCandidates, GAME_NAMES.VAMOS_AO_CINEMA);
  if (vamosAoCinemaTrack) {
    const movies = Object.values(
      await fetchResource<Dictionary<MovieCardData>>(TDR_RESOURCES.MOVIES, language),
    );
    const allReviews = Object.values(
      await fetchResource<Dictionary<MovieReviewCardData>>(TDR_RESOURCES.MOVIE_REVIEWS, language),
    );
    const reviews = getMovieReviews(allReviews);

    customTracks.push({
      game: GAME_NAMES.VAMOS_AO_CINEMA,
      data: {
        movies: sampleSize(movies, 6),
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
    await fetchResource<Dictionary<ChoiceCardData>>(TDR_RESOURCES.CHOICES, language),
  ) as PlainObject[];
  const shuffledChoices = shuffle(allChoices);

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

  const filteredCustomTracks = shuffle(customTracks.filter((track) => !!track?.game));
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
   * vendaval-de-palpite
   */

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

  return sample(options);
};
