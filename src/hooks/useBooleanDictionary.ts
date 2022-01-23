import { useState } from 'react';

export function useBooleanDictionary(
  initialState: BooleanDictionary,
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
