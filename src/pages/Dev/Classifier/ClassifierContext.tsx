import { App } from 'antd';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { cloneDeep, merge } from 'lodash';
import { createContext, ReactNode, useContext, useState } from 'react';
import { QueryKey, UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firestore } from 'services/firebase';

import {
  findFirstIncomplete,
  initialAttributeState,
  parseFirebaseAlienItemDict,
  prepareFirebaseAlienItemDict,
} from './helpers';

import type { AlienItemDict, FirebaseAlienItemDict } from './types';
import { ATTRIBUTES } from './constants';

export type ClassifierContextType = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSaving: boolean;
  data: AlienItemDict;
  save: UseMutateFunction<FirebaseAlienItemDict, unknown, AlienItemDict, unknown>;
  isDirty: boolean;
  reload: () => void;
  itemUtils: {
    latestId: string;
    incompleteId: string;
    create: (itemId: string) => void;
    updateNameEN: (itemId: string, name: string) => void;
    updateNamePT: (itemId: string, name: string) => void;
    updateAttributeValue: (itemId: string, attributeId: string, value: number) => void;
    updateNSFW: (itemId: string, value: boolean) => void;
  };
};

export const ClassifierContext = createContext<ClassifierContextType>({
  isLoading: false,
  isSuccess: false,
  isError: false,
  isSaving: false,
  data: {},
  save: () => {},
  isDirty: false,
  reload: () => {},
  itemUtils: {
    latestId: '',
    incompleteId: '',
    create: () => {},
    updateNameEN: () => {},
    updateNamePT: () => {},
    updateAttributeValue: () => {},
    updateNSFW: () => {},
  },
});

type ClassifierProviderProps = {
  children: ReactNode;
};

export const ClassifierProvider = ({ children }: ClassifierProviderProps) => {
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
  } = useQuery<AlienItemDict>({
    queryKey: ['tdr', 'alienItems'],
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
      const firebaseData = querySnapshot.data() ?? {};
      return parseFirebaseAlienItemDict(firebaseData);
    },
    enabled: isSuccessTR,
    onSuccess: (response) => {
      notification.info({
        message: 'Data loaded',
        placement: 'bottomLeft',
      });
      const merged = merge({}, trData, response) as any;
      const attributeKeys = Object.keys(ATTRIBUTES);

      // Remove hard
      Object.values(merged).forEach((item: any) => {
        // Add missing attributes
        attributeKeys.forEach((attributeKey) => {
          if (item.attributes[attributeKey] === undefined) {
            item.attributes[attributeKey] = 0;
          }
        });

        // Delete any unapproved attributes
        Object.keys(item.attributes).forEach((attributeKey) => {
          if (!attributeKeys.includes(attributeKey)) {
            delete item.attributes[attributeKey];
          }
        });

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
  } = useMutation<FirebaseAlienItemDict, unknown, AlienItemDict, unknown>({
    mutationKey: queryKey,
    mutationFn: async (newData: AlienItemDict) => {
      const docRef = doc(firestore, 'data/alienItems');
      const stringifiedData = prepareFirebaseAlienItemDict(newData);
      await setDoc(docRef, stringifiedData);
      return stringifiedData;
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

  const incompleteId = String(findFirstIncomplete(data));
  const latestId = String(Object.keys(data).length + 1);

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

  return (
    <ClassifierContext.Provider
      value={{
        isLoading: isLoadingTR || isLoadingFirestore,
        isError: isTRError || isError || isMutationError,
        isSuccess: isSuccess || isSaved,
        isSaving: isMutating,
        data,
        save: mutate,
        isDirty,
        reload: fetchItems,
        itemUtils: {
          incompleteId,
          latestId,
          create: createNewItem,
          updateNameEN: updateItemNameEN,
          updateNamePT: updateItemNamePT,
          updateAttributeValue: updateItemAttributeValue,
          updateNSFW,
        },
      }}
    >
      {children}
    </ClassifierContext.Provider>
  );
};

export const useClassifier = () => useContext(ClassifierContext);
