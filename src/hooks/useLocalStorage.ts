import localStorage from '../services/localStorage';

/**
 * Aids getting and setting localStorage values
 * @returns [boolean, function, object]
 */
export function useLocalStorage(): [(property: string) => any, (obj: PlainObject) => any] {
  const getter = (property: string) => {
    return localStorage.get(property);
  };

  const setter = (obj: PlainObject) => {
    localStorage.set({ ...obj });
  };

  return [getter, setter];
}
