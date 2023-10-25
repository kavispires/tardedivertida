import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import type { AlienItemDict, LegacyAlienItemDict } from './types';
import { findLatestId, initialAttributeState } from './helpers';
import { cloneDeep, merge } from 'lodash';
import { FIRST_ID } from './constants';
import { QueryKey, UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { App } from 'antd';

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
    updateNameEN: (itemId: string, name: string) => void;
    updateNamePT: (itemId: string, name: string) => void;
    updateAttributeValue: (itemId: string, attributeId: string, value: number) => void;
    updateNSFW: (itemId: string, value: boolean) => void;
  };
};

/**
 * Handles the alien items document from Firestore.
 * @returns
 */
export function useAlienItemsDocument(): UseAlienItemDocumentReturnValue {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const queryKey = ['data/alienItems'];
  const [data, setData] = useState<AlienItemDict>({});
  const [isDirty, setIsDirty] = useState(false);

  const baseUrl = useTDBaseUrl('tdr');

  const {
    isLoading: isLoadingTR,
    isError: isTRError,
    data: trData,
    isSuccess: isSuccessTR,
  } = useQuery<LegacyAlienItemDict>({
    queryKey: ['td/alienItems'],
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
  } = useQuery<any, unknown, AlienItemDict, QueryKey>({
    queryKey,
    queryFn: async () => {
      const docRef = doc(firestore, 'data/alienItems');
      const querySnapshot = await getDoc(docRef);
      return (querySnapshot.data() ?? {}) as AlienItemDict;
    },
    enabled: isSuccessTR,
    onSuccess: (response) => {
      notification.info({
        message: 'Data loaded',
        placement: 'bottomLeft',
      });
      const merged = merge({}, trData, response) as any;
      // Remove hard
      Object.values(merged).forEach((item: any) => {
        if (!item.attributes.soft) {
          const softVal = (item.attributes.hard ?? 0) * -1;
          item.attributes.soft = softVal;
        }
        if (!item.attributes.solid) {
          item.attributes.solid = 1;
        }
        if (!item.attributes.singular) {
          item.attributes.singular = 1;
        }

        delete item.attributes.hard;
        setData(merged);
        if (typeof item.name === 'string') {
          item.name = {
            en: item.name,
            pt: '',
          };
        }
      });
      // Make it dual language
      setIsDirty(false);
    },
    onError: () => {
      notification.error({
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
      notification.success({
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
        name: {
          en: '',
          pt: '',
        },
        attributes: cloneDeep(initialAttributeState),
      },
    }));
  };

  const updateItemNameEN = (itemId: string, name: string) => {
    setIsDirty(true);
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        name: {
          pt: prevData[itemId].name.pt ?? '',
          en: name,
        },
      },
    }));
  };

  const updateItemNamePT = (itemId: string, name: string) => {
    setIsDirty(true);
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        name: {
          en: prevData[itemId].name.en ?? '',
          pt: name,
        },
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

  const updateNSFW = (itemId: string, nsfw: boolean) => {
    setIsDirty(true);
    setData((prevData) => {
      const copy = cloneDeep(prevData);
      if (nsfw) {
        copy[itemId].nsfw = true;
      } else {
        delete copy[itemId].nsfw;
      }
      return copy;
    });
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
      updateNameEN: updateItemNameEN,
      updateNamePT: updateItemNamePT,
      updateAttributeValue: updateItemAttributeValue,
      updateNSFW,
    },
  };
}
