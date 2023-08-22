import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import type { AlienItemDict } from './types';
import { findLatestId, initialAttributeState } from './helpers';
import { cloneDeep, merge } from 'lodash';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { FIRST_ID } from './constants';
import { QueryKey, UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

export function useItem(initialItem = FIRST_ID) {
  const [itemId, setItemId] = useState(initialItem);

  const previousItem = () => {
    setItemId((cur) => {
      return String(Number(cur) - 1);
    });
  };

  const nextItem = () => {
    setItemId((cur) => {
      return String(Number(cur) + 1);
    });
  };

  const goTo = (target: number | 'first' | 'last') => {
    setItemId((cur) => {
      if (target === 'first') {
        return FIRST_ID;
      }

      if (target === 'last') {
        return initialItem;
      }

      const curNum = Number(cur);
      const result = target + curNum;
      if (result > 0 && result <= Number(initialItem) + 1) {
        return String(Number(cur) + target);
      }

      if (target < 0) {
        return FIRST_ID;
      }

      return initialItem;
    });
  };

  return {
    itemId,
    previousItem,
    nextItem,
    setItemId,
    itemNumber: Number(itemId),
    goTo,
  };
}

export type UseAlienItemDocumentReturnValue = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSaving: boolean;
  data: AlienItemDict;
  save: UseMutateFunction<AlienItemDict, unknown, AlienItemDict, unknown>;
  isDirty: boolean;
  reload: () => void;
  itemUtils: {
    latestId: string;
    create: (itemId: string) => void;
    updateName: (itemId: string, name: string) => void;
    updateAttributeValue: (itemId: string, attributeId: string, value: number) => void;
  };
};

/**
 * Handles the alien items document from Firestore.
 * @param notificationApi
 * @returns
 */
export function useAlienItemsDocument(
  notificationApi: NotificationInstance
): UseAlienItemDocumentReturnValue {
  const queryClient = useQueryClient();
  const queryKey = 'data/alienItems';
  const [data, setData] = useState<AlienItemDict>({});
  const [isDirty, setIsDirty] = useState(false);

  const baseUrl = useTDBaseUrl('tdr');

  const {
    isLoading: isLoadingTR,
    isError: isTRError,
    data: trData,
    isSuccess: isSuccessTR,
  } = useQuery<AlienItemDict>({
    queryKey: 'td/alienItems',
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/alien-items.json`);
      return await response.json();
    },
  });

  const {
    // data: firebaseData = {},
    isLoading: isLoadingFirestore,
    isSuccess,
    isError,
    refetch: fetchItems,
  } = useQuery<AlienItemDict, unknown, AlienItemDict, QueryKey>({
    queryKey,
    queryFn: async () => {
      const docRef = doc(firestore, 'data/alienItems');
      const querySnapshot = await getDoc(docRef);
      return (querySnapshot.data() ?? {}) as AlienItemDict;
    },
    enabled: isSuccessTR,
    onSuccess: (response) => {
      notificationApi.info({
        message: 'Data loaded',
        placement: 'bottomLeft',
      });
      setData(merge({}, trData, response));
      setIsDirty(false);
    },
    select: (response) => {
      return merge({}, trData, response);
    },
    onError: () => {
      notificationApi.error({
        message: 'Error loading data',
        placement: 'bottomLeft',
      });
    },
  });

  const {
    isLoading: isMutating,
    isError: isMutationError,
    isSuccess: isSaved,
    mutate,
  } = useMutation<AlienItemDict, unknown, AlienItemDict, unknown>({
    mutationKey: queryKey,
    mutationFn: async (newData: AlienItemDict) => {
      const docRef = doc(firestore, 'data/alienItems');
      await setDoc(docRef, newData);
      return newData;
    },
    onSuccess: (_, variables) => {
      notificationApi.success({
        message: 'Saved',
        placement: 'bottomLeft',
      });
      queryClient.setQueryData(queryKey, variables);
      setIsDirty(false);
    },
  });

  const latestId = String(findLatestId(data));

  const createNewItem = (itemId: string) => {
    setIsDirty(true);
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        id: itemId,
        name: '',
        attributes: cloneDeep(initialAttributeState),
      },
    }));
  };

  const updateItemName = (itemId: string, name: string) => {
    setIsDirty(true);
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        name,
      },
    }));
  };

  const updateItemAttributeValue = (itemId: string, attributeId: string, value: number) => {
    setIsDirty(true);
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        attributes: {
          ...prevData[itemId].attributes,
          [attributeId]: value,
        },
      },
    }));
  };

  return {
    isLoading: isLoadingTR || isLoadingFirestore,
    isError: isTRError || isError || isMutationError,
    isSuccess: isSuccess || isSaved,
    isSaving: isMutating,
    data,
    save: mutate,
    isDirty,
    reload: fetchItems,
    itemUtils: {
      latestId,
      create: createNewItem,
      updateName: updateItemName,
      updateAttributeValue: updateItemAttributeValue,
    },
  };
}
