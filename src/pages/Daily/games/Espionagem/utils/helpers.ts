import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
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
  black: 'é negro(a)',
  white: 'é branco(a)',
  asian: 'é asiático(a)',
  latino: 'é latino(a)',
  thin: 'é magrelo(a)',
  fat: 'é gordo(a)',
  large: 'é gordo(a)',
  tall: 'é alto(a)',
  short: 'é baixinho(a)',
  young: 'é jovem',
  adult: 'é adulto(a)',
  senior: 'é idoso(a)',
  average: 'tem corpo normal',
  medium: 'é de estatura média',
  mixed: 'é mestiço(a)',
  hat: 'está usando um chapéu',
  tie: 'está usando uma gravata',
  glasses: 'está usando óculos',
  brownHair: 'tem cabelo castanho',
  shortHair: 'tem cabelo curto',
  beard: 'tem barba',
  caucasian: 'é caucasiano(a)',
  scarf: 'está usando um cachecol',
  blondeHair: 'tem cabelo loiro',
  longHair: 'tem cabelo longo',
  greyHair: 'tem cabelo grisalho',
  bald: 'é careca',
  mustache: 'tem bigode',
  goatee: 'tem cavanhaque',
  muscular: 'é musculoso(a)',
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
  'native-american': 'é nativo-americano(a)',
  '18-21': 'é jovem',
  '21-30': 'é adulto(a)',
  '30-40': 'é adulto(a)',
  '40-50': 'é adulto(a)',
  '50-60': 'é idoso(a)',
  '60-70': 'é idoso(a)',
  '70-80': 'é idoso(a)',
  '80-90': 'é idoso(a)',
};
