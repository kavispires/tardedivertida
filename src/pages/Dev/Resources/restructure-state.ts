import { has } from 'lodash';
import { createGlobalState } from 'react-hooks-global-state';

const FILE_NAMES = [
  'meta',
  'arte-ruim',
  'comunicacao-alienigena',
  'contadores-historias',
  'crimes-hediondos',
  'cruza-palavras',
  'detetives-imaginativos',
  'espiao-entre-nos',
  'galeria-de-sonhos',
  'linhas-cruzadas',
  'megamix',
  'mente-coletiva',
  'na-rua-do-medo',
  'onda-telepatica',
  'polemica-da-vez',
  'porta-dos-desesperados',
  'quem-sou-eu',
  'retrato-falado',
  'sonhos-pesadelos',
  'super-campeonato',
  'ta-na-cara',
  'testemunha-ocular',
  'ue-so-isso',
  'vamos-ao-cinema',
  'vendaval-de-palpite',
  'users',
];

export const COLLECTIONS_FILE_NAMES: StringDictionary = {};

export const COLLECTIONS: StringDictionary = {};

const LOAD_CHECK_LIST: BooleanDictionary = {};

const DONE_CHECK_LIST: BooleanDictionary = {};

(function () {
  FILE_NAMES.forEach((fileName) => {
    const key = fileName
      .replace(/-/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toUpperCase();
    COLLECTIONS[key] = key;
    COLLECTIONS_FILE_NAMES[key] = fileName;
    LOAD_CHECK_LIST[key] = false;
    DONE_CHECK_LIST[key] = false;
  });
})();

type RestructureState = {
  LOAD_CHECK_LIST: BooleanDictionary;
  DONE_CHECK_LIST: BooleanDictionary;
};

const initialState: RestructureState = {
  LOAD_CHECK_LIST,
  DONE_CHECK_LIST,
};

// Keep loading global state consistent even with multiple uses of useLoading
const {
  useGlobalState: useRestructureState,
  setGlobalState: setRestructureState,
  getGlobalState: getRestructureState,
} = createGlobalState(initialState);

export function markAsLoaded(key: string) {
  if (has(getRestructureState('LOAD_CHECK_LIST'), key)) {
    setRestructureState('LOAD_CHECK_LIST', (s) => ({ ...s, [key]: true }));
    return;
  }
  throw Error(`key does not exist in the LOAD_CHECK_LIST: ${key}`);
}

export function markAsDone(key: string) {
  if (has(getRestructureState('DONE_CHECK_LIST'), key)) {
    setRestructureState('DONE_CHECK_LIST', (s) => ({ ...s, [key]: true }));
    return (DONE_CHECK_LIST[key] = true);
  }
  throw Error(`key does not exist in the DONE_CHECK_LIST: ${key}`);
}

export { useRestructureState, setRestructureState, getRestructureState };
