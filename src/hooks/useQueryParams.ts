import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryParams(defaultParams: Record<string, string | number> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Adds a query param
   * @param key - the key of the query param to add
   * @param value - the value of the query param to add
   */
  const add = (key: string, value: unknown) => {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, String(value));
    }

    setSearchParams(searchParams);
  };

  /**
   * Removes a query param
   * @param key - the key of the query param to remove
   */
  const remove = (key: string) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (!searchParams.has(key)) {
        add(key, value);
      }
    });
  }, []); // eslint-disable-line

  const queryParams = searchParams
    .toString()
    .split('&')
    .reduce((qp: Record<string, string>, entry) => {
      const [key, value] = entry.split('=');
      if (key && value !== undefined) {
        qp[key] = value;
      }
      return qp;
    }, {});

  return {
    add,
    remove,
    queryParams,
  };
}
