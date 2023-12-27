import localStorage from 'services/localStorage';

/**
 * Aids getting and setting localStorage values
 * @returns [boolean, function, object]
 */
export function useLocalStorage(): [
  (property: string, fallbackValue?: any) => any,
  (obj: PlainObject) => any,
] {
  const getter = (property: string, fallbackValue?: any) => {
    return localStorage.get(property) ?? fallbackValue;
  };

  const setter = (obj: PlainObject) => {
    localStorage.set({ ...obj });
  };

  return [getter, setter];
}
