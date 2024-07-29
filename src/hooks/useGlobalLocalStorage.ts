import { isEqual } from 'lodash';
import { createGlobalState } from 'react-hooks-global-state';
import { useEffectOnce } from 'react-use';

const APP_NAME = 'TD';

type LocalStorageState = {
  blurEnabled: boolean;
  language: Language;
  volume: number;
  cache: PlainObject;
  canvasSize: number;
  latestGameIds: Record<string, number>;
  blurredCards: BooleanDictionary;
};

const initialState: LocalStorageState = {
  blurEnabled: false,
  language: 'en',
  volume: 0.5,
  cache: {},
  canvasSize: 50,
  latestGameIds: {},
  blurredCards: {},
};

const { useGlobalState, setGlobalState } = createGlobalState(initialState);

/**
 * Returns the key for storing a value in local storage.
 *
 * @param property - The property name to generate the key for.
 * @returns The key for storing the value in local storage.
 */
export const getKey = (property: string) => `${APP_NAME}${property}`;

/**
 * Custom hook that provides a way to store and retrieve data in the local storage.
 *
 * @template K - The type of the property to be stored in the local storage.
 * @param property - The property to be stored in the local storage.
 * @returns A tuple containing the current value and a setter function to update the value.
 */
export function useGlobalLocalStorage<K extends keyof LocalStorageState>(property: K) {
  const [value, setGlobalState] = useGlobalState(property);

  const updateValue = (newValue: LocalStorageState[K] | null) => {
    const localStorageKey = getKey(property);
    window.localStorage.setItem(localStorageKey, JSON.stringify(newValue));

    if (newValue === null || newValue === undefined) {
      setGlobalState(initialState[property]);
    } else {
      setGlobalState(newValue);
    }
  };

  useEffectOnce(() => {
    const localStorageKey = getKey(property);
    const localStorageValue = window.localStorage.getItem(localStorageKey);
    const parsedValue = localStorageValue ? JSON.parse(localStorageValue) : null;
    if (
      parsedValue !== undefined &&
      !isEqual(parsedValue, value) &&
      !isEqual(parsedValue, initialState[property])
    ) {
      return updateValue(parsedValue);
    }
  });

  const setter = (newValue: LocalStorageState[K] | null) => {
    updateValue(newValue);
  };

  return [value, setter] as const;
}

export function setGlobalLocalStorage<K extends keyof LocalStorageState>(
  property: K,
  value: LocalStorageState[K] | null
) {
  const localStorageKey = getKey(property);
  window.localStorage.setItem(localStorageKey, JSON.stringify(value));
  setGlobalState(property, value === null ? initialState[property] : value);
}
