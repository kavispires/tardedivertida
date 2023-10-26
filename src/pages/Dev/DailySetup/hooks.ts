import { useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { QueryKey, useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { App } from 'antd';
import { DailyEntry, DailyHistory, DataDrawing, DataSuffixCounts } from './types';
import { shuffle } from 'lodash';
import { getNextDay } from './utils';

function getDocQueryFunction<T>(path: string, docId: string) {
  return async () => {
    console.log(`${path}/${docId}`);
    const docRef = doc(firestore, `${path}/${docId}`);
    const querySnapshot = await getDoc(docRef);
    return (querySnapshot.data() ?? {}) as T;
  };
}

export function useLoadDailySetup() {
  const { notification } = App.useApp();

  // Step 1: Load suffix counts
  const suffixCountsQuery = useQuery<any, Error, DataSuffixCounts, QueryKey>({
    queryKey: ['data', 'suffixCounts'],
    queryFn: getDocQueryFunction<DataSuffixCounts>('data', 'suffixCounts'),
    enabled: true,
    onSuccess: () => {
      notification.info({
        message: 'Data Suffix Counts loaded',
        placement: 'bottomLeft',
      });
    },
    onError: () => {
      notification.error({
        message: 'Error loading suffix counts',
        placement: 'bottomLeft',
      });
    },
  });

  console.log(suffixCountsQuery.data);

  // Step 2: Load drawings
  const drawingsQuery = useLoadDrawings(
    Boolean(suffixCountsQuery.data?.drawingsPT),
    suffixCountsQuery.data?.drawingsPT ?? 0
  );
  const areDrawingsLoading = drawingsQuery.some((q) => q.isLoading);

  console.log(drawingsQuery?.[0]?.data);

  // Step 3: Load daily history
  const historyQuery = useQuery<any, Error, DailyHistory, QueryKey>({
    queryKey: ['daily', 'history'],
    queryFn: getDocQueryFunction<DataSuffixCounts>('daily', 'history'),
    enabled: true,
    onSuccess: () => {
      notification.info({
        message: 'Data Daily History loaded',
        placement: 'bottomLeft',
      });
    },
    onError: () => {
      notification.error({
        message: 'Error loading daily history',
        placement: 'bottomLeft',
      });
    },
  });

  const usedCards = useMemo(() => historyQuery.data?.used ?? [], [historyQuery.data?.used]);
  const latestDate = historyQuery.data?.latestDate ?? '2023-10-31';
  console.log({ usedCards, latestDate });

  // Step 4: Parse entries
  const entries = useMemo(() => {
    const drawings = (drawingsQuery ?? []).reduce((acc: Record<CardId, DailyEntry>, drawingEntry) => {
      const drawingsLibrary = (drawingEntry.data ?? {}) as Record<string, DataDrawing>;
      Object.entries(drawingsLibrary).forEach(([key, dataDrawing]) => {
        if (dataDrawing.drawing.trim().length < 10) {
          console.log('Empty drawing', dataDrawing.cardId);
          return acc;
        }
        if (acc[dataDrawing.cardId] === undefined) {
          acc[dataDrawing.cardId] = {
            id: dataDrawing.cardId,
            type: 'arte-ruim',
            language: 'pt',
            cardId: dataDrawing.cardId,
            text: dataDrawing.text,
            drawings: [dataDrawing.drawing],
            number: 0,
            dataIds: [key],
          };
        } else {
          acc[dataDrawing.cardId].drawings.push(dataDrawing.drawing);
          acc[dataDrawing.cardId].dataIds.push(key);
        }
      });

      return acc;
    }, {});

    console.log({ totalCardCount: Object.keys(drawings).length });

    const atLeastTwoDrawingsList = Object.values(drawings).filter(
      (e) => e.drawings.length > 1 && e.cardId && !e.cardId?.includes('--')
    );

    console.log({ shortlistCardCount: atLeastTwoDrawingsList.length });

    const shortList = Object.values(atLeastTwoDrawingsList).filter((e) => !usedCards.includes(e.cardId));

    const shuffledShortList = shuffle(shortList);

    let lastDate = latestDate;

    return shuffledShortList.map((e, index) => {
      const id = getNextDay(lastDate);

      lastDate = id;
      return {
        ...e,
        id,
        number: index + 1,
      };
    });
  }, [drawingsQuery, usedCards, latestDate]);

  const round5sample = useMemo(() => {
    const drawings = (drawingsQuery ?? []).reduce((acc: Record<CardId, DailyEntry>, drawingEntry) => {
      const drawingsLibrary = (drawingEntry.data ?? {}) as Record<string, DataDrawing>;
      Object.entries(drawingsLibrary).forEach(([key, dataDrawing]) => {
        if (dataDrawing.drawing.trim().length < 10) {
          console.log('Empty drawing', dataDrawing.cardId);
          return acc;
        }
        if (acc[dataDrawing.cardId] === undefined) {
          acc[dataDrawing.cardId] = {
            id: dataDrawing.cardId,
            type: 'arte-ruim',
            language: 'pt',
            cardId: dataDrawing.cardId,
            text: dataDrawing.text,
            drawings: [dataDrawing.drawing],
            number: 0,
            dataIds: [key],
          };
        } else {
          acc[dataDrawing.cardId].drawings.push(dataDrawing.drawing);
          acc[dataDrawing.cardId].dataIds.push(key);
        }
      });

      return acc;
    }, {});

    return Object.values(drawings).filter((e) => e.cardId?.includes('--'));
  }, [drawingsQuery]);

  return {
    isLoading: suffixCountsQuery.isLoading || areDrawingsLoading || historyQuery.isLoading,
    entries,
    latestDate: historyQuery.data?.latestDate,
    round5sample,
  };
}

function useLoadDrawings(enabled: boolean, libraryCount: number) {
  const { notification } = App.useApp();

  const queries = useMemo(() => {
    return new Array(libraryCount).fill(0).map((_, index) => {
      return {
        queryKey: ['data', `drawingsPT${index + 1}`],
        queryFn: getDocQueryFunction('data', `drawingsPT${index + 1}`),
        enabled,
        onSuccess: () => {
          notification.info({
            message: `Data Drawings PT${index + 1} loaded`,
            placement: 'bottomLeft',
          });
        },
      };
    });
  }, [libraryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return useQueries({
    queries,
  });
}

export function useSaveDailySetup() {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  const [isDirty, setIsDirty] = useState(false);

  const query = useMutation<any, Error, DailyEntry[], QueryKey>(
    async (data) => {
      const saves = data.map((entry) => {
        const docRef = doc(firestore, `daily/${entry.id}`);
        return setDoc(docRef, entry);
      });

      const docRec = doc(firestore, `daily/history`);
      const history: DailyHistory = {
        latestDate: data[data.length - 1].id,
        used: data.map((e) => e.cardId),
      };
      setDoc(docRec, history);

      return Promise.all(saves);
    },
    {
      onSuccess: () => {
        notification.info({
          message: 'Data saved',
          placement: 'bottomLeft',
        });
        queryClient.invalidateQueries(['daily', 'history']);
        setIsDirty(false);
      },
      onError: () => {
        notification.error({
          message: 'Error saving data',
          placement: 'bottomLeft',
        });
      },
    }
  );

  return {
    isDirty,
    setIsDirty,
    save: query.mutateAsync,
    isLoading: query.isLoading,
  };
}
