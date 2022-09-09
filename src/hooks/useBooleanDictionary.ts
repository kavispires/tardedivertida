import { useState } from 'react';

export function useBooleanDictionary(
  /**
   * The initial state, usually an empty object
   */
  initialState: BooleanDictionary,
  // Confirm if entry can be added to the dictionary
  validation?: BooleanFunction
): [BooleanDictionary, GenericFunction] {
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

  return [dict, updateDict];
}
