import localStorage from '../services/localStorage';

/**
 * Aids getting and setting localStorage values
 * @returns [boolean, function, object]
 */
export function useLocalStorage() {
  const getter = (property) => {
    return localStorage.get(property);
  };

  const setter = (obj) => {
    localStorage.set({ ...obj });
  };

  return [getter, setter];
}
