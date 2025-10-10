import { cloneDeep, merge } from 'lodash';
import { generateShareableResult, loadLocalToday, writeHeartResultString } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyEspionagemEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  released: [],
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyEspionagemEntry object containing the necessary data for the game.
 * @returns The initial GameState object.
 */
export const getInitialState = (data: DailyEspionagemEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      solution: '',
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    released: localToday.released,
  };

  return state;
};

export const FEATURE_PT_TRANSLATIONS: Dictionary<string> = {
  male: 'é homem',
  female: 'é mulher',
  'non-binary': 'é não-binário(a)',
  black: 'é negro(a)',
  'black.male': 'é negro',
  'black.female': 'é negra',
  'black.non-binary': 'é negre',
  caucasian: 'é branco(a)',
  'caucasian.male': 'é branco',
  'caucasian.female': 'é branca',
  'caucasian.non-binary': 'é branque',
  asian: 'é asiático(a)',
  'asian.male': 'é asiático',
  'asian.female': 'é asiática',
  'asian.non-binary': 'é asiaique',
  latino: 'é latino(a)',
  'latino.male': 'é latino',
  'latino.female': 'é latina',
  'latino.non-binary': 'é latinex',
  thin: 'é magrelo(a)',
  'thin.male': 'é magrelo',
  'thin.female': 'é magrela',
  'thin.non-binary': 'é magrele',
  large: 'é gordo(a)',
  'large.male': 'é gordo',
  'large.female': 'é gorda',
  'large.non-binary': 'é gordix',
  tall: 'é alto(a)',
  'tall.male': 'é alto',
  'tall.female': 'é alta',
  'tall.non-binary': 'é altix',
  short: 'é baixinho(a)',
  'short.male': 'é baixinho',
  'short.female': 'é baixinha',
  'short.non-binary': 'é baixinhe',
  young: 'é jovem',
  adult: 'é adulto(a)',
  'adult.male': 'é adulto',
  'adult.female': 'é adulta',
  'adult.non-binary': 'é adultx',
  senior: 'é idoso(a)',
  'senior.male': 'é da terceira idade',
  'senior.female': 'é da terceira idade',
  'senior.non-binary': 'é da terceira idade',
  average: 'tem corpo normal',
  medium: 'é de altura média',
  mixed: 'é mestiço(a)',
  'mixed.male': 'é mestiço',
  'mixed.female': 'é mestiça',
  'mixed.non-binary': 'é mestiçe',
  hat: 'está usando um chapéu',
  tie: 'está usando uma gravata',
  glasses: 'está usando óculos',
  brownHair: 'tem cabelo castanho',
  shortHair: 'tem cabelo curto',
  beard: 'tem barba',
  scarf: 'está usando um cachecol',
  blondeHair: 'tem cabelo loiro',
  longHair: 'tem cabelo longo',
  greyHair: 'tem cabelo grisalho',
  bald: 'é careca',
  mustache: 'tem bigode',
  goatee: 'tem cavanhaque',
  muscular: 'é sarado(a)',
  'muscular.male': 'é sarado',
  'muscular.female': 'é sarada',
  'muscular.non-binary': 'é sarade',
  blackHair: 'tem cabelo preto',
  hoodie: 'está usando um moletom',
  earrings: 'está usando brincos',
  lipstick: 'está usando batom',
  necklace: 'está usando um colar',
  mediumHair: 'tem cabelo médio',
  'middle-eastern': 'é do Oriente Médio',
  headscarf: 'está usando um lenço na cabeça',
  redHair: 'tem cabelo ruivo',
  piercings: 'tem piercings',
  coloredHair: 'tem cabelo colorido',
  indian: 'é indiano(a)',
  'indian.male': 'é indiano',
  'indian.female': 'é indiana',
  'indian.non-binary': 'é indiane',
  'native-american': 'é nativo-americano(a)',
  noAccessories: 'está sem nenhum acessório',
  avoidingCamera: 'está evitando olhar para a câmera',
  wearingStripes: 'tem listras na roupa',
  blackClothes: 'está vestindo roupas pretas',
  blueClothes: 'está vestindo roupas azuis',
  greenClothes: 'está vestindo roupas verdes',
  redClothes: 'está vestindo roupas vermelhas',
  yellowClothes: 'está vestindo roupas amarelas',
  purpleClothes: 'está vestindo roupas roxas',
  orangeClothes: 'está vestindo roupas laranjas',
  brownClothes: 'está vestindo roupas marrons',
  whiteShirt: 'está usando camisa branca',
  pinkClothes: 'está vestindo roupas rosas',
  patternedShirt: 'está usando roupa estampada',
  buttonShirt: 'está usando camisa com botões',
  bow: 'está usando um laço',
  hairyChest: 'tem peito peludo',
  wearingFlowers: 'está usando flores',
  showTeeth: 'está mostrando os dentes',
  hairTie: 'está usando um xuxinha ou fita no cabelo',
};

/**
 * Generates a shareable result for the game with the given options.
 * @param options - The options for generating the result.
 */
export function writeResult({
  released,
  remainingHearts,
  totalHearts,
  ...rest
}: BasicResultsOptions & {
  released: string[];
}): string {
  const winIcon = released.length === 11 ? '🏆' : '☠️';

  // Calculate percentage based on how many suspects were released (0-11)
  const progress = released ? Math.round((released.length / 11) * 100) : 0;

  return generateShareableResult({
    additionalLines: [`${winIcon} ${writeHeartResultString(remainingHearts, totalHearts)} (${progress}%)`],
    hideHearts: true,
    remainingHearts,
    totalHearts,
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyEspionagemEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyEspionagemEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: 'espionagem',
    hideLink: true,
    language,
    challengeNumber: state.number,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    released: state.released,
  });
}
