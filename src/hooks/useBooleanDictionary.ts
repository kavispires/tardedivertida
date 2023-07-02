import { Dispatch, useState } from 'react';

type UseBooleanDictionaryReturnValue = {
  /**
   * The dictionary
   */
  dict: BooleanDictionary;
  /**
   * Set the dictionary
   */
  setDict: Dispatch<React.SetStateAction<BooleanDictionary>>;
  /**
   * Add or remove an entry from the dictionary
   * @param key - The key to add or remove
   */
  updateDict: (key: string) => void;
  /**
   * Reset the dictionary to the initial state
   */
  reset: () => void;
  /**
   * The number of entries in the dictionary
   */
  length: number;
  /**
   * The list of keys in the dictionary
   */
  keys: string[];
};

/**
 * A dictionary of booleans
 * @param initialState - The initial state, usually an empty object
 * @param validation - A function to validate if an entry can be added to the dictionary
 * @returns - A dictionary of booleans and its functions
 */
export function useBooleanDictionary(
  initialState: BooleanDictionary,
  validation?: BooleanFunction
): UseBooleanDictionaryReturnValue {
  const [dict, setDict] = useState(initialState);

  const updateDict = (key: string) => {
    const isValid = !validation || validation(dict);
    if (!dict[key] && isValid) {
      setDict((s) => ({
        ...s,
        [key]: true,
      }));
    } else {
      const dictCopy = { ...dict };
      delete dictCopy[key];
      setDict(dictCopy);
    }
  };

  const reset = () => setDict(initialState);

  const keys = Object.keys(dict);

  return {
    dict,
    setDict,
    updateDict,
    reset,
    keys,
    length: keys.length,
  };
}
