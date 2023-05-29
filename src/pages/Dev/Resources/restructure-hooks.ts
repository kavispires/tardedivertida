import { useQuery } from 'react-query';
import { COLLECTIONS_FILE_NAMES, markAsLoaded } from './restructure-state';
import { FIREFOO_COLLECTIONS_KEY } from './restructure-utils';
import { useEffect } from 'react';

function returnAppropriatedData(data: any): any {
  if (data.data) return returnAppropriatedData(data.data);
  if (Object.keys(data).length === 1 && data[FIREFOO_COLLECTIONS_KEY]) {
    return data[FIREFOO_COLLECTIONS_KEY];
  }
  return data;
}

function returnAppropriatedLegacyData(data: any) {
  const newData: PlainObject = {};
  Object.entries(data.data).forEach(([gameId, colObject]) => {
    const session = (colObject as PlainObject)[FIREFOO_COLLECTIONS_KEY]?.session;
    if (session && session.meta && session.state && session.players && session.store) {
      delete session.meta[FIREFOO_COLLECTIONS_KEY];
      delete session.state[FIREFOO_COLLECTIONS_KEY];
      delete session.players[FIREFOO_COLLECTIONS_KEY];
      delete session.store[FIREFOO_COLLECTIONS_KEY];

      newData[gameId] = { ...session };
    } else {
      delete data[gameId];
      console.log({ DELETE_LEGACY: gameId });
    }
  });

  return newData;
}

export function useBackupJson(key: string, enabled: boolean, onSuccess = () => {}) {
  const fileName = COLLECTIONS_FILE_NAMES[key];

  const legacy = useQuery({
    queryKey: [fileName, 'legacy'],
    queryFn: async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/back-up/${fileName}-legacy.json`);
      return response.json();
    },
    select: returnAppropriatedLegacyData,
    onSuccess: () => {
      console.log('Loaded:', `${fileName}-legacy`);
    },
    enabled,
  });

  const query = useQuery({
    queryKey: fileName,
    queryFn: async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/back-up/${fileName}.json`);
      return response.json();
    },
    select: returnAppropriatedData,
    onSuccess: () => {
      markAsLoaded(key);
      console.log('Loaded:', fileName);
      onSuccess();
    },
    enabled: legacy.isFetched && enabled,
  });

  return {
    isLoading: legacy.isLoading || query.isLoading,
    data: Boolean(query.data) ? { ...query.data, ...legacy.data } : null,
  };
}

export function useParseGame(
  collectionKey: string,
  enabled: boolean,
  parser: GenericFunction,
  metas?: Metas
) {
  const { isLoading, data } = useBackupJson(collectionKey, enabled);

  useEffect(() => {
    if (!isLoading && data && metas) {
      parser(collectionKey, metas, data);
    }
  }, [isLoading, data, collectionKey, parser, metas]);

  return {
    isLoading,
    data,
  };
}
